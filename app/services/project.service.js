const db = require('../config/db.config');
const emailService = require('../services/email.service');
const Project = db.projects;
const Doc = db.documents;
const Content = db.contents;
const sequelize = db.sequelize;


module.exports = {
    createProject,
    findAll,
    findByUserId,
    getProject,
    update,
    remove
}

// Create a project
async function createProject(req, res) {
    return emailService.addUserToProject(req)
        .then((val) => {
            return Project.create({
                "name": req.name,
                "description": req.description,
                "creatorId": req.creatorId,
                "members": req.members,
                "documents": req.documents
            })
        })
}

// List all projects
async function findAll() {
    // Save to PostgreSQL database
    return Project.findAll();
}

// List user projects or common users projects
async function findByUserId(req) {
    // console.log("req.id : " + req);
    return sequelize.query("SELECT * from projects WHERE members @> ARRAY" + "[" + req + "]::integer[]", {
        model: Project,
        mapToModel: true // pass true here if you have any mapped fields
    });
}

// Get single project
async function getProject(req) {
    return Project.findByPk(req.params.id);
}

//Update project informations
async function update(req, id) {
    // Save to PostgreSQL database
    Project.update(req.body,
        { where: { id: id } });
}

// Delete a project
async function remove(id) {
    // Save to PostgreSQL database
    Project.destroy({ where: { id: id } })
        .then((result) => {
            Doc.destroy({ where: { projectid: result.id } })
        })
        .then((result) => {
            Content.destroy({ where: { documentid: id } });
        })
}