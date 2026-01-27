
import json
import re
import os

QURAN_DATA_FILE = "quran_data.js"
TRANSLATION_FILE = "en.ahmedraza.json"

def load_quran_data():
    if not os.path.exists(QURAN_DATA_FILE):
        print(f"Error: {QURAN_DATA_FILE} not found.")
        return None

    with open(QURAN_DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    match = re.search(r'window\.GLOBAL_QURAN_DATA\s*=\s*(\{.*\});?', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from quran_data.js: {e}")
            return None
    else:
        print("Error: Could not find GLOBAL_QURAN_DATA assignment in file.")
        return None

def load_translation_data():
    if not os.path.exists(TRANSLATION_FILE):
        print(f"Error: {TRANSLATION_FILE} not found.")
        return None
    
    with open(TRANSLATION_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error decoding {TRANSLATION_FILE}: {e}")
            return None

def save_quran_data(data):
    if os.path.exists(QURAN_DATA_FILE):
        # We already have backups from previous run, but let's be safe
        # If .bak exists, maybe rename it to .bak2? No need to overcomplicate.
        pass

    json_output = json.dumps(data, ensure_ascii=False) 
    final_content = f"window.GLOBAL_QURAN_DATA = {json_output};"
    
    with open(QURAN_DATA_FILE, "w", encoding="utf-8") as f:
        f.write(final_content)
    print(f"Successfully wrote updated data with English translation to {QURAN_DATA_FILE}")

def main():
    quran_data = load_quran_data()
    trans_data = load_translation_data()

    if not quran_data or not trans_data:
        return

    # Structure check for en.ahmedraza.json
    # {"quran": {"en.ahmedraza": { "1": { "id":1, "surah":1, "ayah":1, "verse": "..." }, ... }}}
    
    try:
        verses_map = trans_data["quran"]["en.ahmedraza"]
    except KeyError:
        print("Error: unexpected structure in translation file.")
        return

    print("Merging English translation data...")
    updates_count = 0
    errors_count = 0
    
    quran_lookup = {}
    if "data" in quran_data and "surahs" in quran_data["data"]:
        for surah in quran_data["data"]["surahs"]:
            s_num = surah["number"]
            for ayah in surah["ayahs"]:
                a_num = ayah["numberInSurah"]
                quran_lookup[(s_num, a_num)] = ayah
    else:
        print("Error: Invalid quran_data structure.")
        return

    for key, item in verses_map.items():
        s_id = item["surah"]
        a_id = item["ayah"]
        text_en = item["verse"]

        target_ayah = quran_lookup.get((s_id, a_id))
        
        if target_ayah:
            target_ayah["translation_en"] = text_en
            updates_count += 1
        else:
            print(f"Warning: Could not find Surah {s_id} Ayah {a_id} in quran_data.js")
            errors_count += 1

    print(f"Merge complete. Updated {updates_count} ayahs with English translation.")
    if errors_count > 0:
        print(f"Encountered {errors_count} lookup errors.")

    save_quran_data(quran_data)

if __name__ == "__main__":
    main()
