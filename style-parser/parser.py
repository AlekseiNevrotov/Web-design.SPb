import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def parse_css_links(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    css_links = []
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href")
        if href:
            full_url = urljoin(url, href)
            css_links.append(full_url)
    return css_links

def download_css(css_urls):
    for css_url in css_urls:
        try:
            css_response = requests.get(css_url)
            print(f"--- CSS from {css_url} ---")
            print(css_response.text[:1000])  # Показать первые 1000 символов
            print("\n")
        except Exception as e:
            print(f"Ошибка при загрузке {css_url}: {e}")

site_url = "https://example.com"  # Замени на нужный URL
css_files = parse_css_links(site_url)
download_css(css_files)