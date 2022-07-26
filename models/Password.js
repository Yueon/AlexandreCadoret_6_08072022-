// on appelle password validator
var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
// le modèle du mot de passe
passwordSchema
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().lowercase()
    .has().symbols(1)
    .has().digits(1)
    .is().not(/[\]()[{}<>@]/)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
// exportation du shema modele
module.exports = passwordSchema;
