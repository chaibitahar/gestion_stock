// models/Utilisateur.js

import { DataTypes } from 'sequelize'
import database from '../connexion.js' 
import Role from './Role.js' // Importe le modèle Role

// Définition du Modèle
const Utilisateur = database.define('Utilisateur', {
  // PK 'id' est créé automatiquement par Sequelize

  nom: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  prenom: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  email: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    unique: true // L'email doit être unique pour l'authentification
  },
  motDePasse: { 
    type: DataTypes.STRING, // La chaîne hachée sera longue (bcrypt)
    allowNull: false 
  },
  // Sequelize ajoutera automatiquement le champ 'roleId' 
  // grâce à la définition de la relation ci-dessous.
}, {
  timestamps: false,
  freezeTableName: true 
})

// Définition de la Relation 1-à-N : Utilisateur appartient à un seul Rôle (N-à-1)
// Cette ligne indique à Sequelize d'ajouter le champ 'roleId' (Clé Étrangère) à la table 'Utilisateur'.
Utilisateur.belongsTo(Role, {
    foreignKey: 'roleId',
    onDelete: 'RESTRICT', // Empêche la suppression d'un rôle si des utilisateurs y sont liés [cite: 831, 862]
    onUpdate: 'RESTRICT' // Empêche la mise à jour de la clé du rôle si des utilisateurs y sont liés [cite: 831, 862]
})

export default Utilisateur