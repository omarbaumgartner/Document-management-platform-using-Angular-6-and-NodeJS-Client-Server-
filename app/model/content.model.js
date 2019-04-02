module.exports = (sequelize, Sequelize) => {
    const Content = sequelize.define('content', {
        content: {
            type: Sequelize.STRING
        },
        documentid: {
            type: Sequelize.INTEGER
        }
    });

    return Content;
}

