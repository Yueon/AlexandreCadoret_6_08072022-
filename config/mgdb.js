const mongoose = require('mongoose');

mongoose.connect(
    "mongodb+srv://" +
    process.env.MONGO_DB_USER +
    ":" +
    process.env.MONGO_DB_USER_MDP +
    '@cluster0.5ziul.mongodb.net/' +
    process.env.MONGO_DB_MARQUE,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
