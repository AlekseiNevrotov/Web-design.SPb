from flask import Flask, request, render_template
import requests
from bs4 import BeautifulSoup

app = Flask(__name__, template_folder="../templates")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form.get("url")
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.text, "html.parser")
            styles = soup.find_all("style")
            links = soup.find_all("link", rel="stylesheet")
            css_output = ""

            for style in styles:
                css_output += style.get_text() + "\n"

            for link in links:
                href = link.get("href")
                if href and href.startswith("http"):
                    css_output += f"\n/* CSS from: {href} */\n"
                    css_output += requests.get(href).text + "\n"

            return f"<pre>{css_output}</pre>"
        except Exception as e:
            return f"Ошибка: {e}"

    return render_template("index.html")