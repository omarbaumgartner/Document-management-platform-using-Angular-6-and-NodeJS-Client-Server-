module.exports = function (app) {
    const docs = require('../controller/doc.controller.js');

    // Create a new Doc
    app.post('/api/docs', docs.create);

    // Retrieve all Docs
    app.get('/api/docs', docs.findAll);

    // Retrieve a single Doc by Id
    app.get('/api/docs/:id', docs.findByPk);

    // Update a Doc with Id
    app.put('/api/docs', docs.update);

    // Delete a Doc with Id
    app.delete('/api/docs/:id', docs.delete);

}