// routes/produitRoutes.js

import express from 'express'
import { 
    getAllProduits, 
    getProduitById, 
    addProduit, 
    updateProduit, 
    deleteProduit 
} from '../controllers/ProduitController.js'

const router = express.Router()

router.route('/')
    .get(getAllProduits)  // GET /api/produits
    // Nous allons ajouter la pagination et les variables de query ici plus tard
    .post(addProduit)     // POST /api/produits

router.route('/:id')
    .get(getProduitById)   // GET /api/produits/:id
    .put(updateProduit)    // PUT /api/produits/:id
    .delete(deleteProduit) // DELETE /api/produits/:id

export default router