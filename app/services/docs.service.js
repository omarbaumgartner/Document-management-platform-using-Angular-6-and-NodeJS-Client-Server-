const DIR = '../uploads';
var fs = require('fs');
//const path = require('path');
const db = require('../config/db.config.js');
const Doc = db.documents;
const Content = db.contents;
const sequelize = db.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

Doc.hasMany(Content);
Content.belongsTo(Doc);


module.exports = {
    getFiles,
    getFileContent,
    uploadFile,
    createDoc,
    newDocVersion,
    getDocs,
    getSingleDoc,
    findAll,
    findByPk,
    getContByPk,
    updateCont,
    searchFor,
    update,
    remove,
};




//Retrieve a document from db by Id
async function findByPk(req) {
    // Save to PostgreSQL database
    return Doc.findByPk(req.params.id);
}

async function getContByPk(req) {
    console.log(req.params.id)
    return Content.findByPk(req.params.id)
}

//Create Doc, Create content and Initialize Doc Version
async function createDoc(req, res) {
    console.log(req);
    Doc.create({
        "projectid": req.projectid,
        "authorid": req.authorid,
        "filename": req.filename,
        "path": req.path,
    })
        .then((DocVal) => {
            // you can now access the newly created task via the variable task
            Content.create({
                "content": "",
                "documentid": DocVal.id,

            }).then((ContentVal) => {
                //console.log("Val.id " + ContentVal.id);
                Doc.update({ versions: sequelize.fn('array_append', sequelize.col('versions'), ContentVal.id) }, { where: { id: DocVal.id } })
            }).catch(function (err) {
                // print the error details
                console.log(err, req.content);
            });
            // console.log('success');
        })
        .catch(function (err) {
            // print the error details
            console.log(err, req.content);
        });
}

// Create new version of same doc
async function newDocVersion(req) {
    return Content.create({
        "content": req.path,
        "documentid": req.id,

    }).then((ContentVal) => {
        //console.log("Val.id " + ContentVal.id);
        Doc.update({ versions: sequelize.fn('array_append', sequelize.col('versions'), ContentVal.id) }, { where: { id: req.id } })
        return ContentVal.id
    }).catch(function (err) {
        // print the error details
        console.log(err, req.content);
    });

}

//Get single Doc informations
async function getSingleDoc(req) {
    return Doc.findOne({ where: { id: req.params.id } })
}

async function getDocs(req) {
    return Doc.findAll({ where: { projectid: req.params.id } })
}

//Update a document by Id
async function update(req, id) {
    // Save to PostgreSQL database
    Doc.update(req.body,
        { where: { id: id } });
}

async function updateCont(req, id) {
    Content.update(req.body, { where: { id: id } });
}

async function remove(id) {
    // Save to PostgreSQL database
    Doc.destroy({ where: { id: id } })
        .then((val) => {
            //console.log("Val.id " + ContentVal.id);
            Content.destroy({ where: { documentid: id } });
        }).catch(function (err) {
            // print the error details
            console.log(err, req.content);
        });
}

//Retrieve all documents from db
async function findAll() {
    return Doc.findAll();
}

// Search for a Doc by Keyword
async function searchFor(keyword, res) {

    return sequelize.query("SELECT * from documents FULL OUTER JOIN contents ON documents.id = contents." + 'documentid' + " WHERE documents.filename ILIKE '%" + keyword + "%' OR contents.content ILIKE '%" + keyword + "%'");


}





/* //Envoie des métadatas + contenu du fichier dans la BDD
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
} */

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