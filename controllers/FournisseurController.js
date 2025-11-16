// controllers/FournisseurController.js

import Fournisseur from '../models/Fournisseur.js' // Importez le modèle Fournisseur [cite: 149]

// --- 1. READ (All) : Récupérer tous les fournisseurs (GET /fournisseurs) ---
export const getAllFournisseurs = async (req, res) => {
    try {
        // La méthode findAll() est utilisée pour lire toutes les données d'une table [cite: 147, 152]
        const result = await Fournisseur.findAll() 
        // Code de statut HTTP 200: OK [cite: 158, 212, 227]
        res.status(200).json({ data: result }) 
    } catch (error) {
        // Code de statut HTTP 500: Erreur côté serveur
        res.status(500).json({ message: error.message }) 
    }
}


// --- 2. READ (One) : Récupérer un fournisseur par ID (GET /fournisseurs/:id) ---
export const getFournisseurById = async (req, res) => {
    // Récupérer l'ID à partir des paramètres de la route (req.params) [cite: 167]
    const { id } = req.params 

    // Vérification de base (une validation plus robuste sera ajoutée plus tard)
    if (!id) return res.status(400).json({ message: 'L\'ID est requis.'}) // Code 400: Bad Request [cite: 169, 178, 205]

    try {
        // La méthode findByPk(id) prend la clé primaire en paramètre [cite: 164, 165]
        // Note: Dans Sequelize, on peut passer l'ID directement, ou { id: id }
        const result = await Fournisseur.findByPk(id) 
        
        if (!result) {
            // Code de statut HTTP 404: Not Found [cite: 159, 179, 193, 213, 228]
            return res.status(404).json({ message: 'Fournisseur non trouvé.' })
        }
        
        // Code de statut HTTP 200: OK [cite: 158, 212, 227]
        res.status(200).json({ data: result })
    } catch (error) {
        // En cas d'erreur de base de données ou autre
        res.status(500).json({ message: error.message })
    }
}


// --- 3. CREATE : Ajouter un nouveau fournisseur (POST /fournisseurs) ---
export const addFournisseur = async (req, res) => {
    // Les données à insérer sont dans le corps de la requête (req.body) [cite: 184]
    const newFournisseur = { 
        nom: req.body.nom, 
        contactEmail: req.body.contactEmail 
    }

    try {
        // La méthode create() prend le modèle (l'objet) en paramètre [cite: 186, 196]
        const result = await Fournisseur.create(newFournisseur) 
        // Code de statut HTTP 201: Created / Ajouté [cite: 186, 192, 1259]
        res.status(201).json({ data: result, message: "Fournisseur créé avec succès."}) 
    } catch (error) {
        // Gérer les erreurs de validation, de contrainte unique, etc.
        res.status(400).json({ message: error.message }) // Utiliser 400 pour les erreurs de validation/insertion
    }
}


// --- 4. UPDATE : Mettre à jour un fournisseur (PUT/PATCH /fournisseurs/:id) ---
export const updateFournisseur = async (req, res) => {
    // Récupérer l'ID à partir des paramètres de la route (req.params) [cite: 202]
    const { id } = req.params

    // Les données de mise à jour sont dans le corps de la requête
    const updatedData = { 
        nom: req.body.nom, 
        contactEmail: req.body.contactEmail 
    }

    if (!id) return res.status(400).json({ message: 'L\'ID est requis.' }) // Code 400: Bad Request [cite: 205]
    
    try {
        // La méthode update() prend les nouvelles données et une clause { where: { id } } en paramètres [cite: 206, 214]
        const [updatedRows] = await Fournisseur.update(updatedData, { where: { id } }) 

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` })
        }
        
        // Code de statut HTTP 200: OK [cite: 212]
        res.status(200).json({ message: `Fournisseur avec l'ID ${id} mis à jour avec succès.`, updatedRows }) 
    } catch (error) {
        res.status(400).json({ message: error.message }) // Utiliser 400 pour les erreurs de validation/mise à jour
    }
}


// --- 5. DELETE : Supprimer un fournisseur (DELETE /fournisseurs/:id) ---
export const deleteFournisseur = async (req, res) => {
    // Récupérer l'ID à partir des paramètres de la route (req.params)
    const { id } = req.params

    if (!id) return res.status(400).json({ error: true, message: "L'ID est requis." }) 

    // >> MODIFICATION ICI : Assurez-vous que l'ID est un nombre <<
    const idAsInt = parseInt(id) 

    try {
        // Utilisez l'ID converti dans la clause WHERE
        const deletedRows = await Fournisseur.destroy({ where: { id: idAsInt }}) 

        if (deletedRows === 0) {
            return res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` }) // Code 404: Not Found [cite: 228]
        }
        
        // Code de statut HTTP 200: OK [cite: 227]
        res.status(200).json({ message: `Le fournisseur ${id} a été supprimé avec succès.` })
    } catch (error) {
        // Code de statut HTTP 400 pour éviter d'exposer des détails internes si c'est une FK constraint
        res.status(400).json({ error: true, message: error.message }) 
    }
}