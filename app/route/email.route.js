module.exports = function (app) {
    const emails = require('../controller/email.controller.js');

    // Email notification : Lost Password
    app.get('/api/password/:email', emails.lostPassword);

    // Password reset 
    app.post('/api/password/reset', emails.changePassword);

    // Retrieve user notifications
    app.get('/api/notif/:id', emails.getNotifications)

    // Update notification
    app.get('/api/notif/open/:id', emails.updateNotifications)



}