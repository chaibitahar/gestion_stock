// index.js (Mise à jour pour inclure Express et toutes les routes)

import express from 'express' // Importez Express
import connexion from './connexion.js' 

// Importation des modèles (déjà existants)
import Role from './models/Role.js' 
import Utilisateur from './models/Utilisateur.js' 
import Categorie from './models/Categorie.js' 
import Fournisseur from './models/Fournisseur.js' 
import Produit from './models/Produit.js' 
import HistoriqueStock from './models/HistoriqueStock.js'

// Importation de TOUS les routeurs
import fournisseurRoutes from './routes/fournisseurRoutes.js'
import categorieRoutes from './routes/categorieRoutes.js'
import produitRoutes from './routes/produitRoutes.js'
import historiqueStockRoutes from './routes/historiqueStockRoutes.js'
import utilisateurRoutes from './routes/utilisateurRoutes.js'

// ----------------------------------------------------
// --- Configuration Express ---
// ----------------------------------------------------
const app = express()

// Middlewares requis (comme le body-parser pour le JSON)
app.use(express.json()) // Permet de lire les requêtes au format JSON (req.body)
// D'autres middlewares comme cors, helmet, compression devraient être ajoutés ici plus tard

// Liaison des routes aux chemins de base (Endpoints)
// Nous utilisons '/api/' comme préfixe pour tous nos endpoints
app.use('/api/fournisseurs', fournisseurRoutes)
app.use('/api/categories', categorieRoutes)
app.use('/api/produits', produitRoutes)
app.use('/api/stock/historique', historiqueStockRoutes) // Un chemin plus spécifique pour l'historique
app.use('/api/utilisateurs', utilisateurRoutes)
// ----------------------------------------------------

const startDB = async () => {
    try {
        // 1. Authentification à la DB
        await connexion.authenticate()
        console.log('Connexion à la base de données réussie !')

        // 2. Synchronisation des modèles 
        await Role.sync() 
        await Utilisateur.sync() 
        await Categorie.sync() 
        await Fournisseur.sync() 
        await Produit.sync() 
        await HistoriqueStock.sync()
        console.log('Toutes les tables sont créées avec succès.')

        // 3. Démarrage du serveur Express
        const PORT = process.env.PORT || 5000 
        app.listen(PORT, () => console.log(`Serveur Express running on port ${PORT}`))
    } catch (error) {
        console.error('Erreur de connexion ou de démarrage:', error.message)
    }
}

startDB()