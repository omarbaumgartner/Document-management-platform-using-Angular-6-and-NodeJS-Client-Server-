module.exports = function (app) {
    const proj = require('../controller/project.controller.js');

    // Create a project
    app.post('/api/project', proj.createProject);

    // List all projects
    app.get('/api/projects', proj.listAllProjects);

    // List user projects
    app.post('/api/projects', proj.findProjectsByUserId);

    // Get single project
    app.get('/api/project/:id', proj.getSingleProject)

    // Update a project
    app.put('/api/project', proj.updateProject)

    // Delete a project
    app.delete('/api/project/:id', proj.removeProject)


}