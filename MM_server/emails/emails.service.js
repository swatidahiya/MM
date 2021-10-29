const nodemailer = require('nodemailer');
const ical = require('ical-generator');

var fs = require("fs");

module.exports = {
    sendEmail,
    getIcalObjectInstance
};

async function sendEmail(to, subject, body, calendarObj = null){
    
    
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
        // attachments
    };
    if (calendarObj) {
        let alternatives = {
            "Content-Type": "text/calendar",
            "method": "REQUEST",
            "content": new Buffer(calendarObj.toString()),
            "component": "VEVENT",
            "Content-Class": "urn:content-classes:calendarmessage"
        }
    mailOptions['alternatives'] = alternatives;
    mailOptions['alternatives']['contentType'] = 'text/calendar'
    mailOptions['alternatives']['content'] = new Buffer(calendarObj.toString())
}

    let info = await transporter.sendMail(mailOptions);
   console.log(info)

    return info;
    

}


function getIcalObjectInstance(starttime, summary, description, url , name , email){
    const cal = ical({ domain: "mmv1.checkboxtechnology.com", name: 'My test calendar event' });
    // cal.domain("mmdemo-free.checkboxtechnology.com");
    cal.createEvent({
        start: starttime,                    
        summary: summary,         
        description: description,       
        url: url,                 
        organizer: {              
            name: name,
            email: email
        },
    });
return cal;
}

