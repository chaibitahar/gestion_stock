// index.js

// ... (vos importations existantes)
import connexion from './connexion.js' 

import Role from './models/Role.js' 
import Utilisateur from './models/Utilisateur.js' 

// Importez les nouveaux modèles
import Categorie from './models/Categorie.js' 
import Fournisseur from './models/Fournisseur.js' 
import Produit from './models/Produit.js' // <--- Le nouveau modèle
import HistoriqueStock from './models/HistoriqueStock.js'
// ... (votre configuration Express)

const startDB = async () => {
    try {
        await connexion.authenticate()
        console.log('Connexion à la base de données réussie !')

        // 2. Synchronisation des modèles (ajoutez les nouveaux modèles ici)
        // L'ordre est important (la cible de la FK avant le FK)
        await Role.sync() 
        await Utilisateur.sync() 
        
        await Categorie.sync() 
        await Fournisseur.sync() 
        await Produit.sync() // Synchronisez le modèle central en dernier
        
        await HistoriqueStock.sync()
        console.log('Toutes les tables (Roles, Utilisateurs, Catégories, Fournisseurs, Produits) sont créées avec succès.')

        // ... (Démarrage du serveur Express)
    } catch (error) {
        console.error('Erreur de connexion ou de démarrage:', error.message)
    }
}

startDB()