module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        suggestionId: {
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

    return Comment;
}

