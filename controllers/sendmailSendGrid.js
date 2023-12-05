const nodemailer = require("nodemailer");

const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendMail = async (From, To, Subject, Text, successMsg, errorMsg, callback) => {
    const data = {
      from: From, // sender address
      to: To, // list of receivers
      subject: Subject, // Subject line
      text: Text, // plain text body
    }
    console.error('Error sending test email', data);
    try {
      let email = await sendGridMail.send(data);
      console.log('Email sent successfully', email);
      console.log("info ", successMsg);
      return callback({ success: true, message: successMsg });
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
      console.log('send email error ', err)
      return callback({success:false, message:errorMsg});
    }

}