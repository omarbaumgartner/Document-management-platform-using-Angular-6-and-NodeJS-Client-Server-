module.exports = (sequelize, Sequelize) => {
    const Notif = sequelize.define('notification', {
        userid: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        opened: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    return Notif;
}