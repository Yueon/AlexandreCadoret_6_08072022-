// on appelle le modèle de la sauce
const Sauce = require("../models/Sauce");
//permet de modifier le système de fichiers
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.thing);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
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
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
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
