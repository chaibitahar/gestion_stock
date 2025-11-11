// models/Produit.js

import { DataTypes } from 'sequelize'
import database from '../connexion.js' 
// Importez les modèles cibles des FK
import Categorie from './Categorie.js' 
import Fournisseur from './Fournisseur.js' 

// Définition du Modèle
const Produit = database.define('Produit', {
  // PK 'id' est créé automatiquement
  
  nom: { 
    type: DataTypes.STRING(100), 
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER, // Le stock est géré en nombres entiers
    allowNull: false,
    defaultValue: 0 // Le stock par défaut est 0
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2), // Nombre décimal pour les prix (10 chiffres, 2 après la virgule)
    allowNull: false
  },
  // Les Clés Étrangères seront ajoutées automatiquement par les relations
}, {
  timestamps: false,
  freezeTableName: true 
})

// --- Définition des Relations 1-à-N (N-à-1) ---

// Relation 1 : Produit appartient à une Categorie (N-à-1)
// Cette ligne crée le champ 'categorieId' dans la table Produit
Produit.belongsTo(Categorie, {
    foreignKey: 'categorieId',
    onDelete: 'RESTRICT', // Ne permet pas de supprimer une Catégorie si des produits y sont liés
    onUpdate: 'RESTRICT'
})

// Relation 2 : Produit appartient à un Fournisseur (N-à-1)
// Cette ligne crée le champ 'fournisseurId' dans la table Produit
Produit.belongsTo(Fournisseur, {
    foreignKey: 'fournisseurId',
    onDelete: 'RESTRICT', // Ne permet pas de supprimer un Fournisseur si des produits y sont liés
    onUpdate: 'RESTRICT'
})

export default Produit