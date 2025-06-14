const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que uses (Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  try {
    await transporter.sendMail({
      from: `"ReservApp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email enviado a:', to);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}

module.exports = sendEmail;
