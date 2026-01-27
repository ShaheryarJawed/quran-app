
import json
import re
import os

QURAN_DATA_FILE = "quran_data.js"
TRANSLATION_FILE = "ur.jalandhry.json"

def load_quran_data():
    if not os.path.exists(QURAN_DATA_FILE):
        print(f"Error: {QURAN_DATA_FILE} not found.")
        return None

    with open(QURAN_DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Strip the variable assignment "window.GLOBAL_QURAN_DATA = " and trailing ";"
    # Be robust about whitespace
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
    # Ensure backups
    if os.path.exists(QURAN_DATA_FILE):
        os.rename(QURAN_DATA_FILE, QURAN_DATA_FILE + ".bak")
        print(f"Backed up original file to {QURAN_DATA_FILE}.bak")

    json_output = json.dumps(data, ensure_ascii=False) # Minified for size, or indent=4 for read
    # Let's keep it somewhat compact but readable if needed, usually minified is better for load
    # The original was one line, so json.dumps defaults (no indent) is 1 line.
    
    final_content = f"window.GLOBAL_QURAN_DATA = {json_output};"
    
    with open(QURAN_DATA_FILE, "w", encoding="utf-8") as f:
        f.write(final_content)
    print(f"Successfully wrote updated data to {QURAN_DATA_FILE}")

def main():
    quran_data = load_quran_data()
    trans_data = load_translation_data()

    if not quran_data or not trans_data:
        return

    # The structure of ur.jalandhry.json seems to be:
    # {"quran": {"ur.jalandhry": { "1": { "id":1, "surah":1, "ayah":1, "verse": "..." }, ... }}}
    
    try:
        verses_map = trans_data["quran"]["ur.jalandhry"]
    except KeyError:
        print("Error: unexpected structure in translation file.")
        return

    print("Merging translation data...")
    updates_count = 0
    errors_count = 0

    # Index quran_data for faster lookup? 
    # Actually, quran_data is hierarchical: data -> surahs -> list of surahs -> ayahs -> list of ayahs
    # We can create a lookup map for quran_data: { (surah_num, ayah_num): ayah_object }
    
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

    # Iterate through new translations
    for key, item in verses_map.items():
        s_id = item["surah"]
        a_id = item["ayah"]
        text_ur = item["verse"]

        # Find in existing data
        target_ayah = quran_lookup.get((s_id, a_id))
        
        if target_ayah:
            target_ayah["translation_ur"] = text_ur
            updates_count += 1
        else:
            print(f"Warning: Could not find Surah {s_id} Ayah {a_id} in quran_data.js")
            errors_count += 1

    print(f"Merge complete. Updated {updates_count} ayahs.")
    if errors_count > 0:
        print(f"Encountered {errors_count} lookup errors.")

    save_quran_data(quran_data)

if __name__ == "__main__":
    main()
