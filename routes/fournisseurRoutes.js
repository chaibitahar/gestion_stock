// routes/fournisseurRoutes.js

import express from 'express'
// Importez toutes les fonctions du contrôleur
import { 
    getAllFournisseurs, 
    getFournisseurById, 
    addFournisseur, 
    updateFournisseur, 
    deleteFournisseur 
} from '../controllers/FournisseurController.js'

// Créez une instance du Router d'Express
const router = express.Router()

// --- Définition des Routes CRUD pour l'entité Fournisseur ---

// Route pour GET (Voir tous) et POST (Créer)
// Chemin: /api/fournisseurs
router.route('/')
    .get(getAllFournisseurs)  // Correspond à GET /api/fournisseurs
    .post(addFournisseur)     // Correspond à POST /api/fournisseurs

// Route pour GET (Voir un seul), PUT/PATCH (Mettre à jour) et DELETE (Supprimer)
// Chemin: /api/fournisseurs/:id
// Le ':id' permet de passer un paramètre de route (req.params.id) [cite: 174, 221]
router.route('/:id')
    .get(getFournisseurById)   // Correspond à GET /api/fournisseurs/:id
    .put(updateFournisseur)    // Correspond à PUT /api/fournisseurs/:id (Mise à jour complète)
    // Note: Dans ce cas, nous utilisons PUT pour la mise à jour, comme un PATCH n'est pas nécessaire ici

// Exportez le routeur pour qu'il puisse être utilisé dans index.js
export default router