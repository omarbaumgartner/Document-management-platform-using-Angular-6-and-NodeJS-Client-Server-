module.exports = function (app) {
    const proj = require('../controller/project.controller.js');

    // Create a project
    app.post('/api/project', proj.createProject);

    // List all projects
    app.get('/api/projects', proj.findAll);

    // List user projects
    app.post('/api/projects', proj.findByUserId);

    // Get single project
    app.get('/api/project/:id', proj.getProject)

    // Update a project
    app.put('/api/project', proj.update)

    // Delete a project
    app.delete('/api/project/:id', proj.delete)


}