const nodemailer = require('nodemailer');

var fs = require("fs");

module.exports = {
    sendEmail
};

async function sendEmail(to, subject, body, attachments){
    
    
    let transporter = nodemailer.createTransport({
        host: "mail.checkboxtechnology.com",
        port: 587,
        secure: false,
        ignoreTLS: true,
        auth: {
            user: 'checkx-no-reply@checkboxtechnology.com',
            pass: 'Check@70box'
        }
    });

    let mailOptions = {
        from: "checkx-no-reply@checkboxtechnology.com",
        to,
        subject,
        html: body,
        attachments
    };

    let info = await transporter.sendMail(mailOptions);
   console.log(info)

    return info;
    

}

