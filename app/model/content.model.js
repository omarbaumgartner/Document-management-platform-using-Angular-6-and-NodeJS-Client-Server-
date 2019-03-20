module.exports = (sequelize, Sequelize) => {
    const Content = sequelize.define('suggestion', {
        content: {
            type: Sequelize.STRING
        }
    });

    return Content;
}

