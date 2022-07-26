// on appelle le modèle de la sauce
const Sauce = require("../models/Sauce");
//permet de modifier le système de fichiers
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log("sauceObject", sauceObject)
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log("sauce", sauceObject)
    console.log("paramID", req.params.id)
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                console.log('oui1')
                const filename = sauce.image.split('/images/')[1];
                console.log('oui2')
                fs.unlink(`images/${filename}`, () => {
                    console.log('oui3')
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// accède à une sauce
// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accés
exports.getOneSauce = (req, res, next) => {
    // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
    Sauce.findOne({ _id: req.params.id })
        // status 200 OK et l'élément en json
        .then((sauce) => res.status(200).json(sauce))
        // si erreur envoit un status 404 Not Found et l'erreur en json
        .catch((error) => res.status(404).json({ error }));
};

// accède à toutes les sauces
// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accés
exports.getAllSauce = (req, res, next) => {
    // on veut la liste complète de Sauce alors on utilise find() sans argument
    Sauce.find()
        //  status 200 OK et sauces en json
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        // erreur un status 400 Bad Request et l'erreur en json
        .catch((error) => res.status(400).json({ error }));
};

// like une sauce
exports.likeSauce = (req, res, next) => {
    // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
    Sauce.findOne({ _id: req.params.id })
        //retourne une promesse avec reponse status 200 OK et l'élément en json
        .then((sauce) => {
            console.log('sauce', sauce)
            // définition de variables
            let valeurVote;
            let votant = req.body.userId;
            let like = sauce.usersLiked;
            let unlike = sauce.usersDisliked;
            // determine si l'utilisateur est dans un tableau
            let bon = like.includes(votant);
            let mauvais = unlike.includes(votant);
            // ce comparateur va attribuer une valeur de point en fonction du tableau dans lequel il est
            if (bon === true) {
                valeurVote = 1;
            } else if (mauvais === true) {
                valeurVote = -1;
            } else {
                valeurVote = 0;
            }
            console.log("bon", bon)
            console.log("mauvais", mauvais)
            console.log("valeur du vote", valeurVote)
            console.log("votant", votant)
            console.log("reqBodyLike", req.body.like)
            // ce comparateur va determiner le vote de l'utilisateur par rapport à une action de vote
            // si l'utilisateur n'a pas voté avant et vote positivement
            if (valeurVote === 0 && req.body.like === 1) {
                // ajoute 1 vote positif à likes
                sauce.likes += 1;
                console.log("A voter", sauce.likes)
                // le tableau usersLiked contiendra l'id de l'user
                sauce.usersLiked.push(votant);
                // si l'user a voté positivement et veut annuler son vote
            } else if (valeurVote === 1 && req.body.like === 0) {
                // enlève 1 vote positif
                sauce.likes -= 1;
                console.log("A voter", sauce.likes)
                // filtre/enlève l'id du votant du tableau usersLiked
                const nouveauUsersLiked = like.filter((f) => f != votant);
                // on actualise le tableau
                sauce.usersLiked = nouveauUsersLiked;
                // si l'user a voté négativement et veut annuler son vote
            } else if (valeurVote === -1 && req.body.like === 0) {
                // enlève un vote négatif
                sauce.dislikes -= 1;
                // filtre/enlève l'id du votant du tableau usersDisliked
                const nouveauUsersDisliked = unlike.filter((f) => f != votant);
                // on actualise le tableau
                sauce.usersDisliked = nouveauUsersDisliked;
                // si l'user n'a pas voté avant et vote négativement
            } else if (valeurVote === 0 && req.body.like === -1) {
                // ajoute 1 vote positif à unlikes
                sauce.dislikes += 1;
                // le tableau usersDisliked contiendra l'id de l'user
                sauce.usersDisliked.push(votant);
                // pour tout autre vote, il ne vient pas de l'index/front donc probabilité de tentative de vote illégal
            } else {
                console.log("tentavive de vote illégal");
            }
            console.log("le nombre de like final", sauce.likes)
            console.log("le nombre de dislike final", sauce.dislikes)
            // met à jour la sauce
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked,
                }
            )
                // retourne une promesse avec status 201 Created et message en json
                .then(() => res.status(201).json({ message: "Vous venez de voter" }))
                // en cas d'erreur un status 400 et l'erreur en json
                .catch((error) => {
                    if (error) {
                        console.log(error);
                    }
                });
        })
        // si erreur envoit un status 404 Not Found et l'erreur en json
        .catch((error) => res.status(404).json({ error }));
};