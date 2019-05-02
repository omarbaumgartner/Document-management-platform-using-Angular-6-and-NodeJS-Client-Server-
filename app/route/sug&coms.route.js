module.exports = function (app) {
    const sugcom = require('../controller/sug&coms.controller.js');

    //Retrieve document Suggestions
    app.get('/api/db/sugs/:id', sugcom.getSugs);

    //Create a Suggestion
    app.post('/api/db/sugs', sugcom.newSug);

    //Update a Suggestion
    app.put('/api/db/sugs', sugcom.updateSug);

    //Delete a Suggestion
    app.delete('/api/db/sugs/:id', sugcom.deleteSug);

    /*     //Retrieve suggestion Comments
        app.get('/api/db/coms/:id', sugcom.getComs);
    
        //Create a Comment
        app.post('/api/db/coms', sugcom.newCom);
    
        //Update a Comment
        app.put('/api/db/coms', sugcom.updateCom);
    
        //Delete a Comment
        app.delete('/api/db/coms/:id', sugcom.deleteCom); */
}