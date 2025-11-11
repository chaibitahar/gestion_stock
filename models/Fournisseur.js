// models/Fournisseur.js

import { DataTypes } from 'sequelize'
import database from '../connexion.js' 

const Fournisseur = database.define('Fournisseur', {
  nom: { 
    type: DataTypes.STRING(100), 
    allowNull: false
  },
  contactEmail: { 
    type: DataTypes.STRING(150), 
    unique: true,
    allowNull: true 
  }
}, {
  timestamps: false,
  freezeTableName: true 
})

export default Fournisseur