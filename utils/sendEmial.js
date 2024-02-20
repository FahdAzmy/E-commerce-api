// nodemeiler
const nodemeiler = require("nodemailer");
const sendEmail = async (options) => {
  //1) Create trensporter (service that will send emial like 'gmail')
  const trensporter = nodemeiler.createTransport({
    service: "Gmail",
    port: process.env.Email_Port,
    secure: true,
    auth: {
      user: process.env.Emial_user,
      pass: process.env.Email_passowrd,
    },
  });
  const mailOpts = {
    from: "E-shop <pageshayka@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await trensporter.sendMail(mailOpts);
};
module.exports = sendEmail;
