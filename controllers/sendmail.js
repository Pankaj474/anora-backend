const nodemailer = require("nodemailer");

const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendMail = async (From, To, Subject, Text, successMsg, errorMsg, callback) => {

  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //     pool: true,
  //     maxConnections: 1,
  //     maxMessages: 100,
  //     host: "email-smtp.us-east-2.amazonaws.com", // "smtp-relay.gmail.com",
  //     port: 465,
  //     secure: true, // true for 465, false for other ports like 587
  //     auth: {
  //       user: process.env.AWS_USER,
  //       pass: process.env.AWS_PASS,
  //     },
  //     tls: {
  //       // do not fail on invalid certs
  //       rejectUnauthorized: false,
  //     },
  //   });


  //   // send mail with defined transport object
  //   transporter.sendMail({
  //     from: From, // sender address
  //     to: To, // list of receivers
  //     subject: Subject, // Subject line
  //     text: Text, // plain text body
  //   },
  //     function(err, info) {
  //         if(err) {
  //         console.log('send email error ',err)
  //             return callback(errorMsg);
  //         }
  //         else
  //             console.log("info ",successMsg);
  //             return callback(successMsg);
  //     });

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
    return callback(successMsg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
    console.log('send email error ', err)
    return callback(errorMsg);
  }

}