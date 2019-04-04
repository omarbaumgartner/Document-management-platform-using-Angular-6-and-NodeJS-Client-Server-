var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');



const cors = require('cors')
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = require('./app/config/db.config.js');
// force: true will drop the table if it already exists
db.sequelize.sync({ force: false }).then(() => {
  console.log('Drop and Resync with { force: false }');
  initial();
});

// ---- Routes Imports ----
require('./app/route/user.route.js')(app);
require('./app/route/auth.route.js')(app);
require('./app/route/project.route.js')(app);
require('./app/route/doc.route.js')(app);
require('./app/route/email.route.js')(app);




function initial() {

  // ---- Users ----
  let users = []

  // Init data -> save to MySQL
  const User = db.users;
  for (let i = 0; i < users.length; i++) {
    User.create(users[i]);
  }

  // ---- Docs ----
  let documents = []
  // Init data -> save to MySQL
  const Doc = db.documents;
  for (let i = 0; i < documents.length; i++) {
    Doc.create(documents[i]);
  }


  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });




}

// ---- Authentication ----
require('rootpath')();

const jwt = require('./app/helpers/jwt');
const errorHandler = require('./app/helpers/error-handler');

// use JWT auth to secure the api
//app.use(jwt());

// api routes
//app.use('/auths', require('./app/controller/auth.controller'));

// global error handler
app.use(errorHandler);


// ---- Create a Server ----
var server = app.listen(8080, function () {

  let host = server.address().address
  let port = server.address().port

  console.log("App listening at http://%s:%s", host, port);


})

