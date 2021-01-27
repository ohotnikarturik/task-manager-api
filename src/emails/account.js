const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

// implementation with nodemailer
function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

function sendWelcomeEmail(email, name) {
  const transporterObject = transporter();
  transporterObject.sendMail({
    from: `Task Manager app <${process.env.EMAIL_ADDRESS}>`,
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
    from: `Task Manager app <${process.env.EMAIL_ADDRESS}>`,
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
//     from: process.env.EMAIL_ADDRESS,
//     subject: "Thanks for joining to Task Manager app",
//     text: `Welcome to the app ${name}!`,
//     html: `<h3>Welcome to the app ${name}!</h3>`,
//   });
// };

// function sendDeleteEmail(email, name) {
//   sgMail.send({
//     to: email,
//     from: process.env.EMAIL_ADDRESS,
//     subject: "We're sorry to see you leave",
//     text: `We hope to see you back again someday, ${name}!`,
//     html: `<h3>We hope to see you back again someday, ${name}!</h3>`,
//   });
// }

module.exports = {
  sendWelcomeEmail,
  sendDeleteEmail,
};
