// controllers/ProduitController.js

import Produit from '../models/Produit.js'
// Importez les modèles liés pour l'inclusion dans les requêtes GET (pour voir les détails)
import Categorie from '../models/Categorie.js'
import Fournisseur from '../models/Fournisseur.js'

// --- 1. READ (All) : Récupérer tous les produits (GET) ---
export const getAllProduits = async (req, res) => {
    try {
        // Option 'include' pour afficher les détails de la Catégorie et du Fournisseur
        const result = await Produit.findAll({
            include: [Categorie, Fournisseur]
        }) 
        res.status(200).json({ data: result }) 
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

// --- 2. READ (One) : Récupérer un produit par ID (GET /:id) ---
export const getProduitById = async (req, res) => {
    const { id } = req.params 

    if (!id) return res.status(400).json({ message: 'L\'ID est requis.'}) 

    try {
        // Option 'include' pour afficher les détails des tables liées
        const result = await Produit.findByPk(id, {
            include: [Categorie, Fournisseur]
        }) 
        
        if (!result) {
            return res.status(404).json({ message: 'Produit non trouvé.' })
        }
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// --- 3. CREATE : Ajouter un nouveau produit (POST) ---
export const addProduit = async (req, res) => {
    const newProduit = { 
        nom: req.body.nom, 
        quantite: req.body.quantite || 0, // Par défaut à 0
        prix: req.body.prix,
        categorieId: req.body.categorieId,
        fournisseurId: req.body.fournisseurId,
    }

    try {
        const result = await Produit.create(newProduit) 
        res.status(201).json({ data: result, message: "Produit créé avec succès."}) 
    } catch (error) {
        // Gérer les erreurs (ex: FK inexistante, champ manquant)
        res.status(400).json({ message: error.message }) 
    }
}

// --- 4. UPDATE : Mettre à jour un produit (PUT /:id) ---
// Note: Ici, la mise à jour de la 'quantite' n'est pas recommandée 
// sans un enregistrement dans l'HistoriqueStock.
export const updateProduit = async (req, res) => {
    const { id } = req.params
    const updatedData = { 
        nom: req.body.nom, 
        quantite: req.body.quantite,
        prix: req.body.prix,
        categorieId: req.body.categorieId,
        fournisseurId: req.body.fournisseurId,
    }

    if (!id) return res.status(400).json({ message: 'L\'ID est requis.' }) 
    
    try {
        const [updatedRows] = await Produit.update(updatedData, { where: { id } }) 

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Produit avec l'ID ${id} non trouvé.` })
        }
        
        res.status(200).json({ message: `Produit avec l'ID ${id} mis à jour avec succès.`, updatedRows }) 
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// --- 5. DELETE : Supprimer un produit (DELETE /:id) ---
export const deleteProduit = async (req, res) => {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: true, message: "L'ID est requis." }) 

    try {
        const deletedRows = await Produit.destroy({ where: { id }}) 

        if (deletedRows === 0) {
            return res.status(404).json({ message: `Produit avec l'ID ${id} non trouvé.` }) 
        }
        
        res.status(200).json({ message: `Le produit ${id} a été supprimé avec succès.` })
    } catch (error) {
        res.status(400).json({ error: true, message: error.message }) 
    }
}