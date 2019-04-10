const DIR = '../uploads';
var fs = require('fs');
//const path = require('path');
const db = require('../config/db.config.js');
const Doc = db.documents;
const Content = db.contents;
const sequelize = db.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var mammoth = require("mammoth");

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

//Get content of a document
async function getContByPk(req) {
    console.log(req.params.id)
    return Content.findOne({ where: { documentid: req.params.id } })
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
            if (DocVal.path != "") {
                //console.log("this is an imported doc");
                mammoth.convertToHtml({ path: req.path })
                    .then(function (result) {
                        var html = result.value; // The generated HTML
                        var messages = result.messages; // Any messages, such as warnings during conversion
                        Content.create({
                            "content": html,
                            "documentid": DocVal.id,

                        }).then((ContentVal) => {
                            fs.unlinkSync(req.path)
                            //console.log("Val.id " + ContentVal.id);
                            Doc.update({ versions: sequelize.fn('array_append', sequelize.col('versions'), ContentVal.id) }, { where: { id: DocVal.id } })
                        }).catch(function (err) {
                            // print the error details
                            console.log(err, req.content);
                        });
                    })
                    .done();
            }

            else {
                //console.log("this is a new doc")
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
            }
        })
        .catch(function (err) {
            // print the error details
            console.log(err, req.content);
        });
}

//Uploader a file
function uploadFile(req, res) {
    /*     console.log("Project Id : " + req.body.projectId)
        console.log("User Id : " + req.body.userId) */
    for (i = 0; i < req.files.length; i++) {
        if (req.files[i]) {
            var contentfrompath = req.files[i].destination + "/" + req.files[i].filename;
            // req.files[i].set('projectId', req.body.projectId);
            // req.files[i].set('userId', req.body.userId);
            req.files[i].projectid = req.body.projectId;
            req.files[i].authorid = req.body.userId;
            //console.log(req.files[i]);
            createDoc(req.files[i]);

        }
        else {
            console.log("No File(s) Received");
        }
    }
}

async function getDocs(req) {
    return Doc.findAll({ where: { projectid: req.params.id } })
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

//Update document infos by Id
async function update(req, id) {
    // Save to PostgreSQL database
    Doc.update(req.body,
        { where: { id: id } });
}

//Update document content
async function updateCont(req, id) {
    Content.update(req.body, { where: { id: id } });
}

// Remove a document with its contents
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

// Search for a Doc by Keyword
async function searchFor(keyword, res) {

    return sequelize.query("SELECT * from documents FULL OUTER JOIN contents ON documents.id = contents." + 'documentid' + " WHERE documents.filename ILIKE '%" + keyword + "%' OR contents.content ILIKE '%" + keyword + "%'");


}

//Retrieve all documents from db
async function findAll() {
    return Doc.findAll();
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