module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define('project', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        creatorId: {
            type: Sequelize.INTEGER
        },
        members: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        },
        finished: {
            type: Sequelize.BOOLEAN
        }
    });

    return Project;
}

