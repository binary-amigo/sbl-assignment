const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(subject, to, content) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Imran Khan" ${process.env.EMAIL_USER_ID}`, // sender address
    to: to,
    subject: subject, // Subject line
    text: content, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = { sendEmail };
