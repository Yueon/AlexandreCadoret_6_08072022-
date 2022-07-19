const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Yueon:process.env.MONGO_DB_USER_MDP@cluster0.5ziul.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
