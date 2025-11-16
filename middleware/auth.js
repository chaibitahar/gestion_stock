// middleware/auth.js

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config() 
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut'

/**
 * Middleware d'authentification pour vérifier la validité du JWT
 */
export const authentification = (req, res, next) => {
    // 1. Récupérer l'en-tête Authorization (souvent en minuscules)
    const authHeader = req.headers.authorization

    // 2. Vérification de l'existence et du format 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized : Jeton manquant ou mal formaté
        return res.status(401).json({ message: 'Accès refusé. Jeton d\'authentification manquant ou invalide.' })
    }

    // 3. Extraction du jeton (on retire 'Bearer ' qui a 7 caractères)
    const token = authHeader.split(' ')[1]

    try {
        // 4. Vérification et décodage du jeton
        // jwt.verify utilise JWT_SECRET pour vérifier si le jeton est valide et non expiré
        const payload = jwt.verify(token, JWT_SECRET)

        // 5. Ajout des données de l'utilisateur décodées à l'objet de requête (req.utilisateur contiendra {id, roleId})
        req.utilisateur = payload

        // 6. Si tout est valide, passer à la fonction du contrôleur
        next()
    } catch (error) {
        // Si la vérification échoue (jeton expiré, secret invalide, etc.)
        return res.status(401).json({ message: 'Accès refusé. Jeton invalide ou expiré.' })
    }
}