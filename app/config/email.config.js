const nodemailer = require('nodemailer');

module.exports = function sendEmail(to, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kopakola141@gmail.com',
            pass: 'cartoon-007',
        },
    });
    const mailOptions = {
        from: 'kopakola141@gmail.com',
        to,
        subject,
        text: message,
        html: message,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error)
        }
    });
};