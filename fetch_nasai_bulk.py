import urllib.request
import json
import ssl

def fetch_nasai_bulk():
    # Bypass SSL verification if needed (for some environments)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print("Listing editions...")
    try:
        url = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json"
        with urllib.request.urlopen(url, context=ctx) as response:
            data = response.read()
            editions = json.loads(data)
    except Exception as e:
        print(f"Failed to fetch editions: {e}")
        return

    nasai_urdu = None
    # editions is a dict: name -> details
    for name in editions.keys():
         if "nasai" in name and "urdu" in name:
             print(f"Found candidate: {name}")
             nasai_urdu = name
             break
    
    if not nasai_urdu:
        nasai_urdu = "urd-nasai" # Fallback
        print("Guessing edition name: urd-nasai")
    
    # Fetch data
    found = False
    urls_to_try = [
        f"https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/{nasai_urdu}.json",
        "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-sunanannasai.json"
    ]

    for url in urls_to_try:
        print(f"Trying to fetch from {url}...")
        try:
            with urllib.request.urlopen(url, context=ctx) as response:
                if response.status == 200:
                    data = json.loads(response.read())
                    found = True
                    break
        except Exception as e:
            print(f"Failed with {url}: {e}")
    
    if not found:
        print("Could not fetch data.")
        return

    hadiths = data.get("hadiths", [])
    print(f"Fetched {len(hadiths)} hadiths.")

    # Check coverage
    coverage = 0
    samples = {}
    for h in hadiths:
        # Check diverse formats of hadithnumber
        num = h.get("hadithnumber")
        text = h.get("text", "")
        # Try to cast to float/int
        try:
            val = float(num)
            if 3800 <= val <= 5700:
                coverage += 1
                if coverage < 5:
                    samples[num] = text
        except:
            pass
            
    print(f"Coverage in 3800-5700 range: {coverage} items.")
    print("Samples:", json.dumps(samples, ensure_ascii=False, indent=2))
    
    with open("nasai_bulk_urdu.json", "w", encoding="utf-8") as f:
        json.dump(hadiths, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    fetch_nasai_bulk()
