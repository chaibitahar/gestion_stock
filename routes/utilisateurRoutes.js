// routes/utilisateurRoutes.js

import express from 'express'
import { authentification } from '../middleware/auth.js' 
// Importation du module de validation
import { check, validationResult } from 'express-validator' 
import { 
    getAllUtilisateurs,
    getUtilisateurById,
    addUtilisateur,
    updateUtilisateur, 
    deleteUtilisateur,
    loginUtilisateur
} from '../controllers/UtilisateurController.js'

// --- 1. Règles de validation pour la création/mise à jour d'un Utilisateur ---
const userValidationRules = [
    // Vérifie que nom et prenom ne sont pas vides et les nettoie
    check('nom').notEmpty().withMessage('Le nom est requis.').trim().escape(),
    check('prenom').notEmpty().withMessage('Le prénom est requis.').trim().escape(),
    // Vérifie que l'email est au format email et le normalise
    check('email').isEmail().withMessage('L\'email doit être valide.').normalizeEmail(),
    // Vérifie que le mot de passe a une longueur minimale
    check('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
];

// --- 2. Middleware pour collecter et renvoyer les erreurs ---
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // Aucune erreur, passer au contrôleur
    }
    
    // Si des erreurs existent, les formater et renvoyer 400 Bad Request
    const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));
    return res.status(400).json({ errors: extractedErrors });
};

const router = express.Router()

// Route de base /api/utilisateurs
router.route('/')
    // GET : Protégée par l'authentification (authentification)
    .get(authentification, getAllUtilisateurs) 
    // POST : Protégée par les validations (userValidationRules, validate)
    .post(userValidationRules, validate, addUtilisateur)

// Route de Login /api/utilisateurs/login
router.post('/login', loginUtilisateur) 

// Routes par ID /api/utilisateurs/:id (À protéger ultérieurement)
router.route('/:id')
    .get(getUtilisateurById)
    .put(updateUtilisateur)
    .delete(deleteUtilisateur)

export default router