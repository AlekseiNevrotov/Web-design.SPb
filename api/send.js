import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send('Missing fields');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `Новое сообщение от ${name}`,
      text: `От: ${email}\n\n${message}`,
    });

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Ошибка отправки письма:', err);
    return res.status(500).send('Ошибка сервера');
  }
}