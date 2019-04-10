module.exports = (sequelize, Sequelize) => {
    const Content = sequelize.define('content', {
        content: {
            type: Sequelize.TEXT,

        },
        documentid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });

    return Content;
}

