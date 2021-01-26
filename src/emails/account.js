const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

// implementation with nodemailer
function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "arturdevaddress@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

function sendWelcomeEmail(email, name) {
  const transporterObject = transporter();
  transporterObject.sendMail({
    from: "Task Manager app <arturdevaddress@gmail.com>",
    to: email,
    subject: "Thanks for joining in 😊!",
    text: `Welcome to our service, ${name}!`,
    html: `<h3>Welcome to our service, ${name}!</h3>
           <h4>Thank you for joining to Task Manager app!</h4>`,
  });
}

function sendDeleteEmail(email, name) {
  const transporterObject = transporter();
  transporterObject.sendMail({
    from: "Task Manager app <arturdevaddress@gmail.com>",
    to: email,
    subject: "We're sorry to see you leave 😔.",
    text: `We hope to see you back again someday, ${name}!`,
    html: `<h3>We hope to see you back again someday, ${name}!</h3>`,
  });
}

// // implementation with sendGrid
// 
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendWelcomeEmail = (email, name) => {
//   sgMail.send({
//     to: email,
//     from: "arturdevaddress@gmail.com",
//     subject: "Thanks for joining to Task Manager app",
//     text: `Welcome to the app ${name}!`,
//     html: `<h3>Welcome to the app ${name}!</h3>`,
//   });
// };

// function sendDeleteEmail(email, name) {
//   sgMail.send({
//     to: email,
//     from: "arturdevaddress@gmail.com",
//     subject: "We're sorry to see you leave",
//     text: `We hope to see you back again someday, ${name}!`,
//     html: `<h3>We hope to see you back again someday, ${name}!</h3>`,
//   });
// }

module.exports = {
  sendWelcomeEmail,
  sendDeleteEmail,
};
