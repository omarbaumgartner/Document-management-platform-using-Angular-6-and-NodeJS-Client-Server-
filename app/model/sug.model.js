module.exports = (sequelize, Sequelize) => {
    const Suggestion = sequelize.define('suggestion', {
        documentId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        content: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        }
    });

    return Suggestion;
}

