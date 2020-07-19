// adapted from https://github.com/benawad/fullstack-graphql-airbnb-clone/blob/fcd2475fb732fd2e487d5b6fc917f804e631103d/packages/server/src/utils/sendEmail.ts

// import * as nodemailer from "nodemailer";
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");

require("dotenv").config({ debug: process.env.DEBUG });

const transporterOld = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "maxdriveskips@gmail.com",
    // get these credentials as shown here: https://www.youtube.com/watch?v=JJ44WA_eV8E
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    // accessToken:
    //  "ya29.Il-9B_Z-xV0m_ox9Xva1JmlnvPtQsN3swjU6yJtLipcOQ8Zg8dV-iCNSm6ME201KXxrDy-oEL3ZzX7_Y9Uynb1VaenMtr1LjNUvpaXeAzi-UHO_8doGYpcpVIDHXjFvYQQ"
  },
});

// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     type: "OAuth2",
//     user: "maxdriveskips@gmail.com",
//     clientId: process.env.GMAIL_CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.GMAIL_REFRESH_TOKEN
//     // accessToken: process.env.GMAIL_ACCESS_TOKEN
//     // expires: 1484314697598
//   }
// });

const sendEmail = async (recipient, messageText, subject = null) => {
  // const recipient = "mevonstein@gmail.com";
  // const transporter = nodemailer.createTransport({
  //   // host: "smtp.ethereal.email",
  //   // port: 587,
  //   service: "smtp.gmail.com",
  //   auth: {
  //     // user: "sarai.quitzon@ethereal.email",
  //     // pass: "q6U2AhGGkQfpZtmTfg"
  //     user: process.env.GMAIL_USER,
  //     pass: process.env.GMAIL_PASS
  //   }
  // });

  const oAuth2Auth = {
    type: "OAuth2",
    // user: "maxdriveskips@gmail.com",
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // refreshToken: process.env.GMAIL_REFRESH_TOKEN
    // accessToken: process.env.GMAIL_ACCESS_TOKEN
    // expires: 1484314697598
  };

  const simpleAuth = {
    user: "maxdriveskips@gmail.com",
    pass: process.env.GMAIL_PASS,
  };

  let oAuth2Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  });

  let simpleTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: simpleAuth,
  });

  const message = {
    from: "SKIP'S <hi@driveskips.com>",
    // still seems to say <maxdriveskips@gmail.com> "on behalf of"..
    to: `${recipient} <${recipient}>`,
    subject: subject ? subject : "message from Skip's",
    text: messageText,
    html: `<html>
        <body>
        // <p>Testing SparkPost - the world's most awesomest email service!</p>
        <p>${messageText}</p>
        </body>
        </html>`,
    // auth: {
    //   user: "maxdriveskips@gmail.com",
    //   refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    //   accessToken: process.env.GMAIL_ACCESS_TOKEN,
    //   expires: 1484314697598
    // }
  };

  simpleTransporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return {
        success: false,
        message: err.message || "error, no error message received",
      };
    }

    const responseMessage = `Message sent: ${new Date()} ${info.messageId}`;
    console.log(message);
    console.log("To: ", recipient);
    console.log(messageText.slice(0, 45));
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return { success: true, message: responseMessage };
  });

  console.log("sendEmail test");

  return { success: true, message: "response message" };
};

module.exports.sendEmail = sendEmail;
