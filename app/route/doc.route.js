module.exports = function (app) {

    // Configuration 
    const docs = require('../controller/doc.controller.js');
    const DIR = './myuploads';
    const multer = require('multer');
    const path = require('path');
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DIR);
        },
        filename: (req, file, cb) => {
            cb(null, path.parse(file.originalname).name + '_' + Date.now() + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage });

    // Routes 

    // Create a new Doc
    app.post('/api/db/docs', docs.createDoc);

    // Create new version of same Doc
    app.post('/api/db/docs/newversion', docs.newDocVersion);

    // Retrieve Project Docs
    app.get('/api/db/projdocs/:id', docs.getProjectDocs);

    // Retrieve Single Doc informations
    app.get('/api/db/singledoc/:id', docs.getSingleDoc);

    // Update a Doc with Id
    app.put('/api/db/docs', docs.updateDocument);

    // Delete a Doc with Id
    app.delete('/api/db/docs/:id', docs.removeDocument);

    //Retrieve Content BY Id
    app.get('/api/db/cont/:id', docs.getContentById);

    // Update Content by Id
    app.put('/api/db/cont', docs.updateCont);

    // Search Engine
    app.get('/api/db/search/:keyword', docs.searchFor);

    // ---- Upload File Part  ----

    // Upload a file 
    app.post('/api/upload', upload.array('file'), docs.uploadFile);


    //Optionnel-------------------------
    // get content from single file 
    app.get('/api/docs/:filecontent', docs.getFileContent);
    // Retrieve all files
    app.get('/api/docs', docs.getFiles);


    // Optionnal 
    //Retrieve a Doc By Id
    app.get('/api/db/docs/:id', docs.findDocById);

    // Retrieve all Docs
    app.get('/api/db/docs', docs.findAllDocs);




}






