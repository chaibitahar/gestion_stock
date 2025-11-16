// controllers/HistoriqueStockController.js

import HistoriqueStock from '../models/HistoriqueStock.js'
import Produit from '../models/Produit.js' // Nécessaire pour mettre à jour la quantité du produit
import Utilisateur from '../models/Utilisateur.js' // Pour l'inclusion

// --- 1. READ (All) : Récupérer tout l'historique (GET) ---
export const getAllHistorique = async (req, res) => {
    try {
        const result = await HistoriqueStock.findAll({
            // Inclure les détails du Produit et de l'Utilisateur
            include: [Produit, Utilisateur]
        }) 
        res.status(200).json({ data: result }) 
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

// --- 2. CREATE : Enregistrer un nouveau mouvement de stock (POST) ---
export const addMouvementStock = async (req, res) => {
    const { produitId, quantiteChangee, utilisateurId } = req.body

    // Validation minimale
    if (!produitId || !quantiteChangee || !utilisateurId) {
        return res.status(400).json({ message: 'produitId, quantiteChangee et utilisateurId sont requis.' })
    }

    // Convertir la quantité en entier (elle peut être positive ou négative)
    const mouvement = parseInt(quantiteChangee)

    try {
        // 1. Enregistrer le mouvement dans l'historique
        const mouvementEnregistre = await HistoriqueStock.create({
            produitId,
            quantiteChangee: mouvement,
            utilisateurId
        })
        
        // 2. Mettre à jour la quantité du produit
        const produit = await Produit.findByPk(produitId)
        
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé pour la mise à jour du stock.' })
        }

        // Nouvelle quantité = ancienne quantité + mouvement
        const nouvelleQuantite = produit.quantite + mouvement

        if (nouvelleQuantite < 0) {
            // Optionnel: Gérer une tentative de sortie qui rendrait le stock négatif
            // Si c'est le cas, vous devriez idéalement annuler la transaction d'historique (Transactions Sequelize)
        }
        
        await Produit.update(
            { quantite: nouvelleQuantite }, 
            { where: { id: produitId } }
        )

        res.status(201).json({ 
            data: mouvementEnregistre, 
            message: `Mouvement enregistré. Nouveau stock du produit ${produitId}: ${nouvelleQuantite}`
        }) 

    } catch (error) {
        res.status(400).json({ message: error.message }) 
    }
}

// Nous n'incluons pas de fonctions update ou delete pour l'historique,
// car l'historique devrait être immuable.

// --- 3. READ (By Product) : Récupérer l'historique d'un produit (GET /produit/:id) ---
export const getHistoriqueByProduit = async (req, res) => {
    const { idProduit } = req.params 

    if (!idProduit) return res.status(400).json({ message: 'L\'ID du produit est requis.'}) 

    try {
        const result = await HistoriqueStock.findAll({
            where: { produitId: idProduit },
            include: [Produit, Utilisateur],
            order: [['date', 'DESC']] // Afficher le plus récent en premier
        }) 
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}