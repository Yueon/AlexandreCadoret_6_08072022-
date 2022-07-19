// appel de bcrypt
const bcrypt = require("bcrypt");
//appel de jsonwebtoken
const jwt = require('jsonwebtoken');
// appel de model user
const User = require("../models/User");

// enregistrement de nouveaux utilisateurs grace a signup
exports.signup = (req, res, next) => {
    // fonction pour hasher/crypter le mot de passe en 10 tours pour le sel
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // créer un modele User avec email et mot de passe hashé
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // sauvegarde le user dans la base de donnée
            user.save()
                //status 201 Created et message en json
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                // si erreur au hash status 400 Bad Request et message en json
                .catch(error => res.status(400).json({ error }));
        })
        // au cas d'une erreur status 500 Internal Server Error et message en json
        .catch(error => res.status(500).json({ error }));
};

// identification utilisateur grace a login
exports.login = (req, res, next) => {
    // on trouve l'adresse qui est rentré par l'utilisateur
    User.findOne({ email: req.body.email })
        .then(user => {
            // si la requete email ne correspond pas à un utilisateur 
            if (!user) {
                // status 401 Unauthorized et message en json
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            // si c'est ok bcrypt compare le mot de passe de user avec celui rentré par l'utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // retourne un status 401 Unauthorized et un message en json
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // si c'est ok status 201 Created et renvoi un objet json
                    res.status(200).json({
                        // renvoi l'user id
                        userId: user._id,
                        // renvoi un token encodé
                        token: jwt.sign(
                            // user id identique a la requete d'authentification
                            { userId: user._id },
                            // clé secrete pour encodage
                            'RANDOM_TOKEN_SECRET',
                            // durée de vie du token
                            { expiresIn: '24h' }
                        )
                    });
                })
                // erreur status 500 Internal Server Error et message en json
                .catch(error => res.status(500).json({ error }));
        })
        // erreur status 500 Internal Server Error et message en json
        .catch(error => res.status(500).json({ error }));
};
