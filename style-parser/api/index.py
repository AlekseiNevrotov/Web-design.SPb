from flask import Flask, request, render_template
app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form.get("url")
        return f"Ты ввёл ссылку: {url}"
    return render_template("index.html")