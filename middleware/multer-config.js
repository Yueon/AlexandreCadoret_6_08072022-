// on importe multer
const multer = require("multer");
// on définit les images/formats ( comme un dictionnaire)
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/x-icon": "ico",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/tif": "tif",
    "image/webp": "webp",
};
//on enregistre sur le disque
const storage = multer.diskStorage({
    // on choisit la destination
    destination: (req, file, callback) => {
        // null dit qu'il n'y a pas eu d'erreur à ce niveau la et 'images' c'est le nom du dossier
        callback(null, "images");
    },
    // on definit les termes de son appel (nom)
    filename: (req, file, callback) => {
        // nom d'origine du fichier que l'ont transforme si il y a des espaces, on crée un tableau et on join ses éléments par _
        const name = file.originalname.split(" ").join("_");
        // permet de créer une extension de fichiers correspondant au mimetype (via dictionnaire)
        const extension = MIME_TYPES[file.mimetype];
        // aura son nom associé à une date (pour le rendre le plus unique possible) et un point et son extension
        callback(null, name + Date.now() + "." + extension);
    }
});
module.exports = multer({ storage }).single("image");