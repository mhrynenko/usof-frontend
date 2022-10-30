const nodemailer = require("nodemailer");

async function sendEmail(email, title, link) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            service: process.env.MAIL_SERVICE,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            text: '',
            html : `
                <div> 
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                <div>
            `
        });

        return {
            error : null,
            maessage : "email sent sucessfully"
        };
    } catch (error) {
        return {
            error : error,
            message : "email not sent"
        };
    }
};

module.exports = sendEmail;