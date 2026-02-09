#!/bin/bash
# Test which reciter slugs actually work on everyayah.com

reciters=(
    "Alafasy_128kbps"
    "Abdul_Basit_Murattal_192kbps"
    "Yasser_Ad-Dussary_128kbps"
    "Hani_Rifai_192kbps"
    "Mohammad_al_Tablaway_128kbps"
    "Bandar_Baleela_64kbps"
    "muhammad_ayyoub_128kbps"
    "Abdullah_Awad_Al-Juhany_128kbps"
    "Nasser_Alqatami_128kbps"
)

echo "Testing reciters on everyayah.com..."
for reciter in "${reciters[@]}"; do
    url="https://everyayah.com/data/${reciter}/001001.mp3"
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$status" = "200" ]; then
        echo "✓ $reciter - WORKS"
    else
        echo "✗ $reciter - NOT FOUND ($status)"
    fi
done
