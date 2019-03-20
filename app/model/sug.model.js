module.exports = (sequelize, Sequelize) => {
    const Suggestion = sequelize.define('suggestion', {
        documentId: {
            type: Sequelize.INTEGER
        },
        authorId: {
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        }
    });

    return Suggestion;
}

