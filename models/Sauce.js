// appel de mangoose
const mongoose = require("mongoose");

// création d'un schéma de données qui contient les champs souhaités pour chaque Sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    image: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});
// exportation du shema modele
module.exports = mongoose.model("Sauce", sauceSchema);