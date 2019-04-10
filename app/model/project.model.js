module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define('project', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING
        },
        creatorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        members: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            allowNull: false,
        },
        finished: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    return Project;
}

