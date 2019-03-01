const DIR = '../uploads';
var fs = require('fs');
const path = require('path');
const db = require('../config/db.config.js');
const Doc = db.docs;

module.exports = {
    getFiles,
    getFileContent,
    uploadFile,
    createDoc,
    findAll,
    findByPk,
    update,
    remove,
};


//Retrieve documents from db
async function findAll() {
    return Doc.findAll();
}
//Retrieve a document from db by Id
async function findByPk(req) {
    // Save to PostgreSQL database
    return Doc.findByPk(req.params.id);
}
//Update a document by Id
async function update(req, id) {
    // Save to PostgreSQL database
    Doc.update(req.body,
        { where: { id: id } });
}
async function remove(id) {
    // Save to PostgreSQL database
    Doc.destroy({ where: { id: id } });
}



//Envoie des métadatas + contenu du fichier dans la BDD
async function createDoc(req, chemin) {

    Doc.create({
        "filename": req.originalname,
        "relativename": req.filename,
        "encoding": req.encoding,
        "extension": path.extname(req.originalname),
        "path": req.destination + "/" + req.filename,
        "sizeinko": req.size,
        "content": fs.readFileSync(chemin, "utf8"),
    }).then(function (user) {
        // you can now access the newly created task via the variable task
        console.log('success');
    })
        .catch(function (err) {
            // print the error details
            console.log(err, req.content);
        });
    console.log("Added to DataBase");
}

//Uploader un fichier
function uploadFile(req, res) {
    for (i = 0; i < req.files.length; i++) {
        if (req.files[i]) {
            console.log(req.files[i].originalname);
            var contentfrompath = req.files[i].destination + "/" + req.files[i].filename;
            createDoc(req.files[i], contentfrompath);
        }
        else {
            console.log("No File(s) Received");
        }
    }
}

//Optionnel 
//Lister les fichiers et dossiers
async function getFiles() {
    var items = fs.readdirSync(DIR);
    return items;
}
//Prendre le contenu d'un fichier
async function getFileContent(req) {
    var path = DIR + "/" + req.params.filecontent;
    var item = fs.readFileSync(path, "utf8");

    return item;
}