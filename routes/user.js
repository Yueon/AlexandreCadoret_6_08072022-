// pour créer le routeur on a besoin d'express
const express = require("express");
// on créer un routeur avec la méthode Router() d'express
const router = express.Router();
// on importe la logique des routes
const userCtrl = require("../controllers/user");
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