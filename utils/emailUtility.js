const nodemailer = require("nodemailer");

const sendMail = async function (options){
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host:process.env.Email_Host,
        port: process.env.Email_Port,
        secure:false,
        logger:true,
        auth:{
            user:process.env.Email_UserName,
            pass:process.env.Email_Password,

        },

    });

    // 2 Define Email Option 
    const mailOption={
        from:"BATCH 15 APPLICATION",
        to:options.email,
        subject:options.subject,
        text:options.message,
    };

    console.log("send Now");
    await transporter.sendMail(mailOption);
    console.log("Email sent successfully");

    
};

module.exports = sendMail;