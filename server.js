const http = require('http');
const app = require('./app');

const normalizePort = val => {
    //Exécute parseInt, qui convertit essentiellement la valeur en un entier, si possible.
    const port = parseInt(val, 10);
    // si port n'est pas un nombre isNaN(port)
    if (isNaN(port)) {
        return val;
    }
    //  si port est un nombre sup ou égal à 0
    if (port >= 0) {
        return port;
    }
    return false;
};
// constante port qui définit le port
const port = normalizePort(process.env.PORT || '3000');
// dit à l'application express quelle doit tourner sur le 'port' avec la constante port
app.set('port', port);

// la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
    // si le server n'entend rien
    if (error.syscall !== 'listen') {
        //lance une erreur
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
// on passe cette application app en argument pour créer le serveur
const server = http.createServer(app);
// si le server est en erreur appelle la fonction errorHandler qui gère les erreurs
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
// attend et ecoute les requetes envoyées
server.listen(port);
