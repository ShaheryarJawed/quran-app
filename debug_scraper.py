import urllib.request

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}
url = "https://hamariweb.com/islam/hadith/sahih-bukhari-273/"

try:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8')
        with open("debug.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("Saved debug.html")
except Exception as e:
    print(f"Error: {e}")
