module.exports = function (app) {
    const docs = require('../controller/doc.controller.js');

    // Create a new Doc
    app.post('/api/db/docs', docs.createDoc);

    // Retrieve all Docs
    app.get('/api/db/docs', docs.findAll);

    //Retrieve a Doc By Id
    app.get('/api/db/docs/:id', docs.findByPk);

    // Update a Doc with Id
    app.put('/api/db/docs', docs.update);

    // Delete a Doc with Id
    app.delete('/api/db/docs/:id', docs.delete);


    // ---- Upload ----
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
    // Upload a file 
    app.post('/api/upload', upload.array('file'), docs.uploadFile);


    //Optionnel-------------------------
    // get content from single file 
    app.get('/api/docs/:filecontent', docs.getFileContent);
    // Retrieve all files
    app.get('/api/docs', docs.getFiles);

}






