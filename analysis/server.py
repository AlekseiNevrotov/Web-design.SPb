from flask import Flask, request
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

YOUR_EMAIL = "elazarsound@gmail.com"
YOUR_PASSWORD = "riry hliu cvth asmy"  # Gmail app password (НЕ обычный!)

@app.route("/")
def index():
    with open("index.html", "r", encoding="utf-8") as file:
        return file.read()

@app.route("/send", methods=["POST"])
def send():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    msg = MIMEText(f"Имя: {name}\nEmail: {email}\nСообщение:\n{message}", "plain", "utf-8")
    msg["Subject"] = "Заявка с сайта"
    msg["From"] = YOUR_EMAIL
    msg["To"] = YOUR_EMAIL

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(YOUR_EMAIL, YOUR_PASSWORD)
            smtp.send_message(msg)
        return "<h2>Спасибо! Заявка отправлена.</h2>"
    except Exception as e:
        return f"<h2>Ошибка:</h2><pre>{str(e)}</pre>"

if __name__ == "__main__":
    app.run(debug=True)
