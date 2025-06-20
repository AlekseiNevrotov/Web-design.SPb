from flask import Flask, request, render_template_string
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

app = Flask(__name__)

HTML_PAGE = '''
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>CSS Парсер</title></head>
<body>
  <h1>Привет, я твой CSS парсер</h1>
  <form method="POST">
    <label>Вставь URL сайта:<br>
      <input type="text" name="url" size="50" placeholder="https://example.com" required>
    </label>
    <button type="submit">Парсить CSS</button>
  </form>
  {% if css %}
  <h2>Найденные CSS стили:</h2>
  <pre style="background:#f0f0f0; padding:10px; border:1px solid #ccc; overflow-x:auto;">{{ css }}</pre>
  {% endif %}
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def index():
    css_text = ''
    if request.method == 'POST':
        url = request.form.get('url')
        if url:
            try:
                r = requests.get(url)
                soup = BeautifulSoup(r.text, 'html.parser')

                css_chunks = []

                for style_tag in soup.find_all('style'):
                    css_chunks.append(style_tag.string or '')

                for link_tag in soup.find_all('link', rel='stylesheet'):
                    href = link_tag.get('href')
                    if href:
                        css_url = href if href.startswith('http') else urljoin(url, href)
                        css_resp = requests.get(css_url)
                        if css_resp.status_code == 200:
                            css_chunks.append(css_resp.text)

                css_text = '\n\n'.join(css_chunks)

            except Exception as e:
                css_text = f"Ошибка при получении CSS: {e}"

    return render_template_string(HTML_PAGE, css=css_text)

if __name__ == '__main__':
    app.run(debug=True)