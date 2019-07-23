const sgMail = require("@sendgrid/mail");
const config = require('../config');

sgMail.setApiKey(config.sendgridKey)


const sendEmail = async (to,subject,body) => {
    sgMail.send({
        to,
        from: "hello@nodestore.com",
        subject,
        html:body
    })
}


module.exports =  {sendEmail};