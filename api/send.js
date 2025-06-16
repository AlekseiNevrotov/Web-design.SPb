export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Missing fields');
  }

  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // Приложенный пароль, НЕ обычный
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.MAIL_USER, // Куда отправлять
      subject: `Новое сообщение от ${name}`,
      text: message,
    });

    return res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Ошибка при отправке');
  }
}