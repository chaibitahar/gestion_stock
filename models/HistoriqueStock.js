// models/HistoriqueStock.js

import { DataTypes } from 'sequelize'
import database from '../connexion.js' 
import Produit from './Produit.js' 
import Utilisateur from './Utilisateur.js' 

const HistoriqueStock = database.define('HistoriqueStock', {
  // PK 'id' est créé automatiquement
  
  date: {
    type: DataTypes.DATE, // Enregistre la date et l'heure du mouvement
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  quantiteChangee: {
    type: DataTypes.INTEGER, // Stocke les entrées (+N) et sorties (-N)
    allowNull: false
  },
}, {
  timestamps: false,
  freezeTableName: true 
})

// Définition des Clés Étrangères (FK)
// Crée les champs 'produitId' et 'utilisateurId' dans HistoriqueStock
HistoriqueStock.belongsTo(Produit, { foreignKey: 'produitId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
HistoriqueStock.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })

export default HistoriqueStock