const env = require('./env.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('../model/user.model.js')(sequelize, Sequelize);
db.projects = require('../model/project.model')(sequelize, Sequelize);
db.documents = require('../model/doc.model.js')(sequelize, Sequelize);
db.contents = require('../model/content.model')(sequelize, Sequelize);
db.sugs = require('../model/sug.model')(sequelize, Sequelize);
db.coms = require('../model/com.model')(sequelize, Sequelize);

module.exports = db;
