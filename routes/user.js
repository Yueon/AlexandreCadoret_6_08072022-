// pour créer le routeur on a besoin d'express
const express = require("express");
// on créer un routeur avec la méthode Router() d'express
const router = express.Router();
// on importe la logique des routes
const userCtrl = require("../controllers/user");
// appel de rate limiter
// limiter le nombre de requête que peut faire un client
const raterLimit = require("express-rate-limit");
// définition de la limitation de requete
const limiter = raterLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 essais
});
//----------------------------------------------------------------------------------
// ROUTES USER
//----------------------------------------------------------------------------------
// intercepte les requetes post d'inscription
router.post("/signup", userCtrl.signup);
// intercepte les requetes post d'authentification
router.post("/login", userCtrl.login);
//----------------------------------------------------------------------------------
// on exporte router
module.exports = router;