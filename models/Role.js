// models/Role.js

import { DataTypes } from 'sequelize' // Pour définir les types de données (VARCHAR, INT, etc.)
import database from '../connexion.js' // Importe l'objet de connexion Sequelize

// Définition du modèle de la table 'Role'
const Role = database.define('Role', {
  // Le champ 'id' (Clé Primaire/PK) est créé AUTOMATIQUEMENT par Sequelize 
  // en tant que INT(11) AUTO_INCREMENT.

  nom: { 
    type: DataTypes.STRING(50), // Définit le type VARCHAR de longueur 50
    allowNull: false,           // Contrainte: NOT NULL (Le rôle doit avoir un nom)
    unique: true                // Contrainte: UNIQUE (Chaque rôle doit être unique, ex: "Admin" ne peut exister qu'une fois)
  }
}, {
  // Options du modèle
  timestamps: false,        // Empêche Sequelize d'ajouter les colonnes 'createdAt' et 'updatedAt'
  freezeTableName: true     // Assure que la table dans MySQL sera nommée 'Role' et non 'Roles'
})

export default Role