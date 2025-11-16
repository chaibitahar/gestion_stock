// controllers/UtilisateurController.js

import Utilisateur from '../models/Utilisateur.js'
import Role from '../models/Role.js'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv'

dotenv.config() 
// Assurez-vous que cette variable est dans votre .env
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut' 

// --- 1. READ (All) : Récupérer tous les utilisateurs (GET) ---
export const getAllUtilisateurs = async (req, res) => {
    try {
        const result = await Utilisateur.findAll({
            // Exclure le mot de passe pour des raisons de sécurité
            attributes: { exclude: ['motDePasse'] }, 
            include: [Role]
        }) 
        res.status(200).json({ data: result }) 
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

// --- 2. READ (One) : Récupérer un utilisateur par ID (GET /:id) ---
export const getUtilisateurById = async (req, res) => {
    const { id } = req.params 

    if (!id) return res.status(400).json({ message: 'L\'ID est requis.'}) 

    try {
        const result = await Utilisateur.findByPk(id, {
            attributes: { exclude: ['motDePasse'] }, 
            include: [Role]
        }) 
        
        if (!result) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// --- 3. CREATE : Ajouter un nouvel utilisateur (POST) ---
export const addUtilisateur = async (req, res) => {
    try {
        // 1. Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.motDePasse, salt);
        
        const newUser = { 
            nom: req.body.nom, 
            prenom: req.body.prenom,
            email: req.body.email,
            motDePasse: hashedPassword, // Utiliser le hachage
            roleId: req.body.roleId 
        }

        const result = await Utilisateur.create(newUser) 
        
        // Exclure le mot de passe du retour
        result.motDePasse = undefined;
        res.status(201).json({ data: result, message: "Utilisateur créé avec succès."}) 
    } catch (error) {
        res.status(400).json({ message: error.message }) 
    }
}

// --- 4. UPDATE : Mettre à jour un utilisateur (PUT /:id) ---
export const updateUtilisateur = async (req, res) => {
    const { id } = req.params
    let updatedData = { 
        nom: req.body.nom, 
        prenom: req.body.prenom,
        email: req.body.email,
        roleId: req.body.roleId
    }

    if (req.body.motDePasse) { // Hacher seulement si le mot de passe est fourni
        const salt = await bcrypt.genSalt(10);
        updatedData.motDePasse = await bcrypt.hash(req.body.motDePasse, salt);
    }
    
    if (!id) return res.status(400).json({ message: 'L\'ID est requis.' }) 
    
    try {
        const [updatedRows] = await Utilisateur.update(updatedData, { where: { id } }) 

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` })
        }
        
        res.status(200).json({ message: `Utilisateur avec l'ID ${id} mis à jour avec succès.`, updatedRows }) 
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// --- 5. DELETE : Supprimer un utilisateur (DELETE /:id) ---
export const deleteUtilisateur = async (req, res) => {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: true, message: "L\'ID est requis." }) 

    try {
        const deletedRows = await Utilisateur.destroy({ where: { id }}) 

        if (deletedRows === 0) {
            return res.status(404).json({ message: `Utilisateur avec l\'ID ${id} non trouvé.` }) 
        }
        
        res.status(200).json({ message: `L\'utilisateur ${id} a été supprimé avec succès.` })
    } catch (error) {
        res.status(400).json({ error: true, message: error.message }) 
    }
}


// --- 6. AUTHENTIFICATION : Fonction de Login (POST /login) ---
export const loginUtilisateur = async (req, res) => {
    const { email, motDePasse } = req.body;
    
    if (!email || !motDePasse) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    try {
        // 1. Trouver l'utilisateur (inclure motDePasse pour la comparaison)
        const utilisateur = await Utilisateur.findOne({ where: { email } });

        if (!utilisateur) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }
        
        // 2. Comparer le mot de passe fourni avec le hachage enregistré
        const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // 3. Générer le JSON Web Token (JWT)
        const token = jwt.sign(
            { id: utilisateur.id, roleId: utilisateur.roleId }, 
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, utilisateur: { id: utilisateur.id, email: utilisateur.email, roleId: utilisateur.roleId } });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}