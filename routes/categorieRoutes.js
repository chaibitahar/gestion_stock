// routes/categorieRoutes.js

import express from 'express'
import { 
    getAllCategories, 
    getCategorieById, 
    addCategorie, 
    updateCategorie, 
    deleteCategorie 
} from '../controllers/CategorieController.js'

const router = express.Router()

router.route('/')
    .get(getAllCategories)  // GET /api/categories
    .post(addCategorie)     // POST /api/categories

router.route('/:id')
    .get(getCategorieById)   // GET /api/categories/:id
    .put(updateCategorie)    // PUT /api/categories/:id
    .delete(deleteCategorie) // DELETE /api/categories/:id

export default router