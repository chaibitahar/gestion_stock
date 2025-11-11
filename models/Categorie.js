// models/Categorie.js

import { DataTypes } from 'sequelize'
import database from '../connexion.js' 

const Categorie = database.define('Categorie', {
  nom: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true
  }
}, {
  timestamps: false,
  freezeTableName: true 
})

export default Categorie