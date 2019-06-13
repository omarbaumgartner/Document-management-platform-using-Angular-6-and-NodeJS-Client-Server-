const db = require('../config/db.config');
const Doc = db.documents;
const Sug = db.sugs;
const Com = db.coms;
const sequelize = db.sequelize;

module.exports = {
    newSug,
    getSugs,
    updateSug,
    deleteSug,
    newCom,
    getComs,
    updateCom,
    deleteCom,
};


async function newSug(req, res) {
    return Sug.create({
        "documentId": req.documentId,
        "authorId": req.authorId,
        "content": req.content,
    })
}

async function getSugs(req, res) {
    return Sug.findAll({ where: { documentId: req.params.id } })
}

async function updateSug(req, res) {
    Sug.update({ content: req.body.content }, { where: { id: req.body.id } })
}

async function deleteSug(req, res) {
    Sug.destroy({ where: { id: req.params.id } })
}

async function newCom(req, res) {
    console.log(req);
    return Com.create({
        "suggestionid": req.suggestionid,
        "documentid": req.documentid,
        "authorId": req.authorId,
        "content": req.content,
    })
}

async function getComs(req, res) {
    return Com.findAll({
        where: {
            documentid: req.params.id
        }
    })
}

async function updateCom(req, res) {
    Com.update({ content: req.body.content }, { where: { id: req.body.id } })
}

async function deleteCom(req, res) {
    Com.destroy({ where: { id: req.params.id } })
}