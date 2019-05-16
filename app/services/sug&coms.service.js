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