// appel de express
const express = require('express');
// constante app qui sera notre application
const app = express();
// appel de helmet, utilisé pour sécuriser les en-têtes http.
//const helmet = require("helmet");
// appel du fichier de mongodb qui permet la connection à mongodb
require("./mgdb");
// on importe saucesRoutes
const saucesRoutes = require("./routes/sauces");
// on importe userRoutes
const userRoutes = require("./routes/user");
// on on importe path qui donne accès au chemin du système de fichiers
const path = require('path');
// middleware d'helmet
//app.use(helmet());
//----------------------------------------------------------------------------------
// CORS
//----------------------------------------------------------------------------------
// Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
// Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse
// middleware général ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes et sera appliqué à toutes les requetes envoyées au serveur
app.use((req, res, next) => {
    // origine, droit d'accéder c'est tout le monde '*'
    res.setHeader("Access-Control-Allow-Origin", "*");
    // headers, ce sont les headers acceptés (en-tête)
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    // methods,  ce sont les méthodes acceptés (verbe de requete)
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
});
//----------------------------------------------------------------------
// middleware intercepte la requete et la transforme au bon format     
app.use(express.json());
//----------------------------------------------------------------------
// pour cette route la on utilise le router de userRoutes
app.use("/api/auth", userRoutes);
// pour cette route la on utilise le router de saucesRoutes
app.use("/api/sauces", saucesRoutes);
// pour cette route utiliser le fichier statique
app.use("/images", express.static(path.join(__dirname, "images")));


// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers
module.exports = app;