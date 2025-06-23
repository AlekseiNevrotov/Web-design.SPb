const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send({ message: "Missing fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER,
      subject: `Заявка с сайта от ${name}`,
      text: message,
    });

    res.status(200).send({ message: "Письмо успешно отправлено!" });
  } catch (err) {
    console.error("Ошибка отправки:", err);
    res.status(500).send({ message: "Ошибка сервера при отправке письма." });
  }
};