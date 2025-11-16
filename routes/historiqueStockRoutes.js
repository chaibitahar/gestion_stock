// routes/historiqueStockRoutes.js

import express from 'express'
import { 
    getAllHistorique, 
    addMouvementStock, 
    getHistoriqueByProduit
} from '../controllers/HistoriqueStockController.js'

const router = express.Router()

router.route('/')
    .get(getAllHistorique)       // GET /api/stock/historique (Voir tout l'historique)
    .post(addMouvementStock)     // POST /api/stock/historique (Enregistrer un mouvement)
    
router.route('/produit/:idProduit')
    .get(getHistoriqueByProduit) // GET /api/stock/historique/produit/:idProduit (Historique par produit)

// Nous n'avons pas de route PUT/DELETE pour l'historique

export default router