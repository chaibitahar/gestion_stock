// controllers/CategorieController.js

import Categorie from '../models/Categorie.js'

// --- 1. READ (All) : Récupérer toutes les catégories (GET) ---
export const getAllCategories = async (req, res) => {
    try {
        const result = await Categorie.findAll() 
        res.status(200).json({ data: result }) 
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

// --- 2. READ (One) : Récupérer une catégorie par ID (GET /:id) ---
export const getCategorieById = async (req, res) => {
    const { id } = req.params 

    if (!id) return res.status(400).json({ message: 'L\'ID est requis.'}) 

    try {
        const result = await Categorie.findByPk(id) 
        
        if (!result) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' })
        }
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// --- 3. CREATE : Ajouter une nouvelle catégorie (POST) ---
export const addCategorie = async (req, res) => {
    // Le modèle Categorie a seulement 'nom'
    const newCategorie = { 
        nom: req.body.nom, 
    }

    try {
        const result = await Categorie.create(newCategorie) 
        res.status(201).json({ data: result, message: "Catégorie créée avec succès."}) 
    } catch (error) {
        // Gérer l'erreur de contrainte unique sur le 'nom'
        res.status(400).json({ message: error.message }) 
    }
}

// --- 4. UPDATE : Mettre à jour une catégorie (PUT /:id) ---
export const updateCategorie = async (req, res) => {
    const { id } = req.params
    const updatedData = { 
        nom: req.body.nom, 
    }

    if (!id) return res.status(400).json({ message: 'L\'ID est requis.' }) 
    
    try {
        const [updatedRows] = await Categorie.update(updatedData, { where: { id } }) 

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Catégorie avec l'ID ${id} non trouvée.` })
        }
        
        res.status(200).json({ message: `Catégorie avec l'ID ${id} mise à jour avec succès.`, updatedRows }) 
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// --- 5. DELETE : Supprimer une catégorie (DELETE /:id) ---
export const deleteCategorie = async (req, res) => {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: true, message: "L'ID est requis." }) 

    try {
        const deletedRows = await Categorie.destroy({ where: { id }}) 

        if (deletedRows === 0) {
            return res.status(404).json({ message: `Catégorie avec l'ID ${id} non trouvée.` }) 
        }
        
        res.status(200).json({ message: `La catégorie ${id} a été supprimée avec succès.` })
    } catch (error) {
        // Gérer l'erreur si la catégorie est encore liée à des produits (RESTRICT)
        res.status(400).json({ error: true, message: error.message }) 
    }
}