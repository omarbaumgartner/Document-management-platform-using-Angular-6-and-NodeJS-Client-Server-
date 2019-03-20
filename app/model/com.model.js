module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        suggestionId: {
            type: Sequelize.INTEGER
        },
        authorId: {
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        }
    });

    return Comment;
}

