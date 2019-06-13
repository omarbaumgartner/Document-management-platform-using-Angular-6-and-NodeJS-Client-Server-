module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        suggestionid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        documentid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        content: {
            type: Sequelize.STRING
        }
    });

    return Comment;
}

