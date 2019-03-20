const projectService = require('../services/project.service');

// Create a project
exports.createProject = (req, res) => {

    projectService.createProject(req, res)
        .then(project => {
            res.json(project);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

// List all projects
exports.findAll = (req, res) => {
    projectService.findAll()
        .then(projects => {
            // Send All users to Client
            res.json(projects.sort(function (c1, c2) { return c1.id - c2.id }));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

// List user projects
exports.findByUserId = (req, res) => {
    projectService.findByUserId(req.body)
        .then(projects => {
            // Send All users to Client
            res.json(projects);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

// Get single project
exports.getProject = (req, res) => {
    projectService.getProject(req)
        .then(project => {
            // Send All users to Client
            res.json(project);
            // console.log(projects.dataValues);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//Update Project informations
exports.update = (req, res) => {
    const id = req.body.id;
    projectService.update(req, id)
        .then(() => {
            res.status(200).json({ mgs: "Updated Successfully" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};

// Delete a Project by Id
exports.delete = (req, res) => {
    const id = req.params.id;
    projectService.remove(id)
        .then(() => {
            res.status(200).json({ msg: 'Deleted Successfully' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
};