
const SEERAH_DATA = [
    {
        id: "birth",
        year: "570 CE",
        age: "Birth",
        icon: "bx-child",

        // English Data
        title_en: "The Year of the Elephant",
        summary_en: "The blessed birth of the Final Messenger amidst the miraculous protection of the Kaaba.",
        details_en: `
            <p><strong>The Incident of the Elephant</strong><br>
            In the year 570 CE, arguably the most significant year in Arabian history prior to Islam, Yemen's governor Abrahah Al-Ashram marched upon Makkah with a massive army, spearheaded by a colossal elephant named Mahmud. His goal was to demolish the Kaaba to divert pilgrimage to his new cathedral in Sana'a. As the army approached, the elephant knelt and refused to enter the sacred precinct. Birds (Ababeel) darkened the sky, dropping baked clay stones that decimated the army like "eaten straw" (Quran 105:5). This miraculous defense preserved the sanctity of Makkah for the arrival of its greatest inhabitant.</p>

            <p><strong>The Blessed Birth</strong><br>
            Fifty days after this event, on Monday the 12th of Rabi' al-Awwal, Aminah bint Wahb gave birth to a son. His father, Abdullah, had passed away months prior in Yathrib. Aminah reported seeing a light emerge from her that illuminated the palaces of Busra in Syria—a sign that this child's guidance would reach the far corners of the civilized world.</p>

            <p><strong>The Naming</strong><br>
            His grandfather, Abdul-Muttalib, the chief of Quraysh, took the infant fondly to the Kaaba. He circumambulated the Sacred House and named him <strong>Muhammad</strong> ("The Praised One"), a name unfamiliar to the Arabs. When asked why he chose it, he replied, "I desire that he be praised by the inhabitants of the earth and the heavens." He was suckled briefly by Thuwaybah and then by Halimah Al-Sa'diyyah in the desert, where the incident of the "Opening of the Chest" occurred, purifying his heart from a young age.</p>
        `,
        lessons_en: [
            "<strong>Divine Protection:</strong> Allah defends His sanctities directly when the people are helpless.",
            "<strong>Orphanhood:</strong> The Prophet (ﷺ) was born an orphan, teaching humanity that dignity comes from Allah, not worldly lineage or fatherly protection.",
            "<strong>Purity:</strong> His upbringing in the clean air of the desert with Halimah instilled in him eloquence, strength, and a connection to nature."
        ],
        quote_en: "Verily, I am the prayer of my father Ibrahim, and the glad tidings of Jesus.",

        // Urdu Data
        title_ur: "عام الفیل (ہاتھی کا سال)",
        summary_ur: "خانہ کعبہ کی معجزاتی حفاظت کے سائے میں آخری رسول ﷺ کی با برکت ولادت۔",
        details_ur: `
            <p><strong>اصحاب الفیل کا واقعہ</strong><br>
            سن 570 عیسوی میں، جو اسلام سے قبل تاریخ عرب کا اہم ترین سال ہے، یمن کے گورنر ابرہہ نے مکہ پر چڑھائی کی۔ اس کے لشکر میں ایک عظیم ہاتھی 'محمود' شامل تھا اور اس کا مقصد خانہ کعبہ کو منہدم کرنا تھا۔ لیکن اللہ کی قدرت دیکھیے، جب لشکر حرم کے قریب پہنچا تو ہاتھی بیٹھ گیا اور آگے بڑھنے سے انکار کر دیا۔ تب اللہ نے ابابیلوں کا لشکر بھیجا جنہوں نے کنکریاں برسا کر ابرہہ کے لشکر کو "کھائے ہوئے بھوسے" کی طرح کر دیا (سورہ الفیل)۔</p>

            <p><strong>ولادتِ با سعادت</strong><br>
            اس واقعے کے پچاس دن بعد، 12 ربیع الاول بروز پیر، حضرت آمنہ کے ہاں وہ ہستی تشریف لائی جس نے دنیا کو نور سے بھر دینا تھا۔ آپ ﷺ کے والد حضرت عبداللہ وفات پا چکے تھے۔ حضرت آمنہ فرماتی ہیں کہ ولادت کے وقت ان سے ایک ایسا نور نکلا جس سے شام کے محلات روشن ہو گئے، جو اس بات کا اشارہ تھا کہ اس بچے کا پیغام دور دور تک پہنچے گا </p>

            <p><strong>نامِ مبارک</strong><br>
            آپ ﷺ کے دادا عبدالمطلب آپ کو خانہ کعبہ لے گئے اور آپ کا نام <strong>"محمد"</strong> (جس کی بہت زیادہ تعریف کی گئی ہو) رکھا۔ عربوں کے لیے یہ نام نیا تھا۔ جب ان سے پوچھا گیا تو انہوں نے کہا: "میں چاہتا ہوں کہ زمین اور آسمان والے اس کی تعریف کریں۔" آپ ﷺ نے ابتدائی پرورش صحرا میں بی بی حلیمہ سعدیہ کے پاس پائی، جہاں آپ ﷺ کا سینہ مبارک دھویا گیا (شق صدر)۔</p>
        `,
        lessons_ur: [
            "<strong>اللہ کی حفاظت:</strong> جب بندے بے بس ہو جائیں تو اللہ اپنے گھر اور اپنی نشانیوں کی حفاظت خود کرتا ہے۔",
            "<strong>یتیمی:</strong> حضور ﷺ یتیم پیدا ہوئے، یہ بتانے کے لیے کہ عزت اور بلندی باپ کے سائے سے نہیں بلکہ اللہ کے فضل سے ملتی ہے۔",
            "<strong>فطرت:</strong> صحرا کی کھلی فضا میں پرورش نے آپ ﷺ کو فصاحت، بہادری اور فطرت سے قربت عطا کی۔"
        ],
        quote_ur: "بے شک میں اپنے باپ ابراہیم کی دعا اور عیسیٰ (علیہ السلام) کی بشارت ہوں۔"
    },
    {
        id: "revelation",
        year: "610 CE",
        age: "40 Years Old",
        icon: "bx-book-open",

        title_en: "The First Revelation",
        summary_en: "In the solitude of Cave Hira, the heavens connect with the earth. 'Read!'",
        details_en: `
            <p><strong>Solitude in Hira</strong><br>
            As Muhammad (ﷺ) approached the age of 40, his soul grew weary of the idol worship and moral decay of Makkah. He began to retreat to the Cave of Hira on Jabal al-Nur (The Mountain of Light). There, he would spend days in seclusion (*Tahannuth*), contemplating the Creator of the universe. This period was a spiritual preparation for the immense weight he was about to carry.</p>

            <p><strong>The Incident</strong><br>
            One night towards the end of Ramadan, the Angel Jibreel (Gabriel) appeared in the cave in his true form, filling the horizon. He commanded Muhammad (ﷺ), "Iqra!" (Read!). The Prophet, who was unlettered, replied trembling, "Ma ana bi qari" (I cannot read). The angel squeezed him tightly three times until he felt his energy drain, then released him and recited the first verses of the Quran:</p>
            <p><em>"Recite in the name of your Lord who created - Created man from a clinging substance..." (Surah Al-Alaq 96:1-2)</em></p>

            <p><strong>The Return Home</strong><br>
            Terrified and shaking, he rushed down the mountain to his wife Khadijah (RA), crying "Zammilooni!" (Cover me!). He feared for his life/sanity. But Khadijah, the first believer, comforted him with words recorded in history: "No, by Allah! Allah will never disgrace you. You maintain family ties, you bear the burden of the weak, you help the poor, and you honor the guest."</p>
        `,
        lessons_en: [
            "<strong>Knowledge First:</strong> The very first command of Islam was 'Read', highlighting the paramount importance of knowledge and education.",
            "<strong>Preparation:</strong> Great tasks require preparation. Solitude and reflection are essential for spiritual maturity.",
            "<strong>Spousal Support:</strong> The role of Khadijah (RA) shows how a supportive partner acts as an emotional anchor in times of crisis."
        ],
        quote_en: "Read! In the name of your Lord who created...",

        // Urdu Data
        title_ur: "نزولِ وحی (پہلی وحی)",
        summary_ur: "غارِ حرا کی تنہائی میں آسمان کا زمین سے رابطہ۔ 'پڑھ!'",
        details_ur: `
            <p><strong>غارِ حرا کی خلوت</strong><br>
            جب آپ ﷺ کی عمر مبارک 40 برس کے قریب ہوئی تو آپ کا دل مکہ کے شرک اور برائیوں سے بیزار ہو گیا۔ آپ ﷺ نے جبلِ نور پر واقع غارِ حرا میں تنہائی اختیار کر لی۔ وہاں آپ ﷺ کئی کئی دن عبادت اور غور و فکر میں گزارتے۔ یہ دراصل اس عظیم ذمہ داری کی تیاری تھی جو آپ ﷺ کو سونپی جانے والی تھی۔</p>

            <p><strong>واقعہ وحی</strong><br>
            رمضان کی ایک رات، حضرت جبرائیل علیہ السلام غار میں تشریف لائے اور کہا: "اقرأ" (پڑھیے!)۔ آپ ﷺ جو امی (ان پڑھ) تھے، نے جواب دیا: "میں پڑھ نہیں سکتا۔" فرشتے نے آپ ﷺ کو تین بار مضبوطی سے بھینچا یہاں تک کہ آپ کی طاقت جواب دینے لگی، پھر چھوڑا اور قرآن کی پہلی آیات تلاوت کیں:</p>
            <p><em>"پڑھ اپنے رب کے نام سے جس نے پیدا کیا... انسان کو جمے ہوئے خون سے پیدا کیا..." (سورہ العلق)</em></p>

            <p><strong>خدیجہ (رض) کا سہارا</strong><br>
            آپ ﷺ کانپتے ہوئے گھر تشریف لائے اور فرمایا: "مجھے کمبل اڑھا دو!"۔ آپ کو اپنی جان کا خوف تھا۔ ایسے میں حضرت خدیجہ (رض) نے آپ کو تسلی دی اور وہ تاریخی الفاظ کہے: "ہرگز نہیں، اللہ کی قسم! اللہ آپ کو کبھی رسوا نہیں کرے گا۔ آپ صلہ رحمی کرتے ہیں، کمزوروں کا بوجھ اٹھاتے ہیں، غریبوں کی مدد کرتے ہیں اور مہمان نوازی کرتے ہیں۔"</p>
        `,
        lessons_ur: [
            "<strong>علم کی اہمیت:</strong> اسلام کا پہلا حکم 'پڑھ' تھا، جو علم اور شعور کی اہمیت کو اجاگر کرتا ہے۔",
            "<strong>تیاری:</strong> بڑے مقاصد کے لیے تنہائی اور غور و فکر ضروری ہے تاکہ انسان کا باطن مضبوط ہو۔",
            "<strong>شریک حیات کا کردار:</strong> حضرت خدیجہ (رض) کا کردار بتاتا ہے کہ مشکل وقت میں نیک جیون ساتھی انسان کی سب سے بڑی طاقت ہوتا ہے۔"
        ],
        quote_ur: "پڑھ! اپنے رب کے نام سے جس نے پیدا کیا..."
    },
    {
        id: "taif",
        year: "619 CE",
        age: "49 Years Old",
        icon: "bx-cloud-rain",

        title_en: "The Year of Sorrow & Ta'if",
        summary_en: "Rejection, loss, and the bleeding feet of the Prophet (ﷺ) in Ta'if.",
        details_en: `
            <p><strong>A Dual Loss</strong><br>
            The 10th year of Prophethood is etched in history as <em>Amul-Huzn</em> (The Year of Sorrow). Within a short span, the Prophet (ﷺ) lost Abu Talib, his uncle who defended him politically against the Quraysh, and Khadijah (RA), his beloved wife who comforted him emotionally. With them gone, the persecution in Makkah intensified to unbearable levels.</p>

            <p><strong>The Journey to Ta'if</strong><br>
            Seeking a sanctuary, the Prophet headed to Ta'if, a city in the mountains. He approached the chiefs of Banu Thaqif with hope. Not only did they reject his message, but they also mocked him and incited the city's street urchins and slaves to chase him. They lined the path and stoned him until his blessed feet bled and his shoes were clogged with blood.</p>

            <p><strong>The Prayer of the Oppressed</strong><br>
            He collapsed in a vineyard, bleeding and exhausted. There, he raised his hands in a dua that shakes the soul: "O Allah! To You alone I complain of my weakness..." The Angel of Mountains descended, offering to crush Ta'if between two mountains ("Al-Akhshabayn"). But the Mercy to the Worlds (ﷺ) refused, saying, "No, I hope that Allah will bring forth from their descendants those who will worship Him alone."</p>
        `,
        lessons_en: [
            "<strong>Patience over Revenge:</strong> The Prophet chose forgiveness when he had the power to destroy, teaching us that true strength lies in mercy.",
            "<strong>Reliance on Allah:</strong> When all worldly supports (Uncle, Wife) were removed, he turned solely to Allah, demonstrating *Tawakkul*.",
            "<strong>Hope:</strong> Even in the darkest rejection, a visionary keeps hope for the future generations."
        ],
        quote_en: "O Allah, reflect upon my weakness, my lack of resources, and my insignificance before the people.",

        // Urdu Data
        title_ur: "عام الحزن اور سفرِ طائف",
        summary_ur: "غم کا سال، اپنوں کی جدائی اور طائف میں لہولہان قدم۔",
        details_ur: `
            <p><strong>دوہرا صدمہ</strong><br>
            نبوت کا دسواں سال تاریخ میں <em>عام الحزن</em> (غم کا سال) کے نام سے جانا جاتا ہے۔ اس سال آپ ﷺ کے چچا ابو طالب، جو آپ کی ظاہری ڈھال تھے، اور پیاری بیوی حضرت خدیجہ (رض)، جو آپ کا باطنی سکون تھیں، انتقال کر گئے۔ ان کے جانے کے بعد قریش کی ایذا رسانی حد سے بڑھ گئی۔</p>

            <p><strong>طائف کا سفر</strong><br>
            امید کی تلاش میں آپ ﷺ نے طائف کا سفر کیا۔ بنو ثقیف کے سرداروں نے نہ صرف آپ کو رد کیا بلکہ اوباش لڑکوں کو آپ کے پیچھے لگا دیا۔ انہوں نے آپ پر اتنے پتھر برسائے کہ آپ ﷺ کے نعلین مبارک (جوتے) خون سے بھر گئے۔</p>

            <p><strong>رحمت للعالمین</strong><br>
            آپ ﷺ ایک باغ میں نڈھال ہو کر بیٹھ گئے اور اللہ کے حضور اپنی کمزوری کا شکوہ کیا۔ اس وقت پہاڑوں کا فرشتہ آیا اور کہا کہ اگر آپ حکم دیں تو میں طائف کو دو پہاڑوں کے درمیان پیس دوں۔ لیکن رحمت اللعالمین ﷺ نے فرمایا: "نہیں! مجھے امید ہے کہ اللہ ان کی نسلوں سے ایسے لوگ پیدا کرے گا جو صرف ایک اللہ کی عبادت کریں گے۔"</p>
        `,
        lessons_ur: [
            "<strong>عفو و درگزر:</strong> بدلہ لینے کی طاقت کے باوجود معاف کر دینا ہی اصل بہادری ہے۔",
            "<strong>اللہ پر توکل:</strong> جب دنیاوی سہارے (چچا، بیوی) ختم ہو گئے تو آپ نے صرف اللہ کی طرف رجوع کیا، جو توکل کی معراج ہے۔",
            "<strong>امید:</strong> بدترین حالات میں بھی مایوس نہ ہونا اور مستقبل سے خیر کی امید رکھنا مومن کی شان ہے۔"
        ],
        quote_ur: "اے اللہ! میں تجھ ہی سے اپنی کمزوری، بے بسی اور لوگوں کے سامنے اپنی بے قدری کا شکوہ کرتا ہوں۔"
    },
    {
        id: "isra",
        year: "620 CE",
        age: "50 Years Old",
        icon: "bx-rocket",

        title_en: "Al-Isra wal-Mi'raj",
        summary_en: "A journey beyond time and space: From Makkah to Jerusalem, and then to the Heavens.",
        details_en: `
            <p><strong>The Night Journey (Isra)</strong><br>
            Following the sorrows of Ta'if, Allah comforted His Prophet with a miraculous journey. Jibreel (AS) brought the Buraq, a heavenly steed. In a part of the night, Muhammad (ﷺ) traveled from the Kaaba in Makkah to Masjid Al-Aqsa in Jerusalem. There, he led all 124,000 Prophets in prayer, establishing his status as the *Imam al-Anbiya* (Leader of Prophets).</p>

            <p><strong>The Ascension (Mi'raj)</strong><br>
            From Jerusalem, he ascended through the seven heavens. He met Adam, Isa, Yahya, Yusuf, Idris, Harun, Musa, and Ibrahim (peace be upon them). He reached <em>Sidrat al-Muntaha</em> (The Lote Tree), the boundary of creation. There, Allah spoke to him directly and obligated the five daily prayers ("Salah").</p>

            <p><strong>The Gift</strong><br>
            This journey proved that while the people of earth may reject him, the inhabitants of the heavens honored him. He returned with the gift of Salah—the believer's personal ascension (Mi'raj) to connect with their Lord five times a day.</p>
        `,
        lessons_en: [
            "<strong>Status of Salah:</strong> Prayer is so important it was gifted in the heavens, not revealed on earth.",
            "<strong>Al-Aqsa:</strong> The connection between Makkah and Jerusalem is inseparable in Islamic heritage.",
            "<strong>Elevation:</strong> After every hardship (*Usr*) comes relief and elevation (*Yusr*). Ta'if was the low point; Mi'raj was the high point."
        ],
        quote_en: "Glory be to Him who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa...",

        // Urdu Data
        title_ur: "اسراء اور معراج",
        summary_ur: "زمان و مکاں سے ماورا سفر: مکہ سے بیت المقدس، اور پھر آسمانوں تک۔",
        details_ur: `
            <p><strong>اسراء (رات کا سفر)</strong><br>
            طائف کے غموں کے بعد، اللہ نے اپنے محبوب کو ایک عظیم سفر سے نوازا۔ حضرت جبرائیل "براق" لے کر آئے۔ رات کے ایک حصے میں آپ ﷺ مسجد حرام سے مسجد اقصیٰ (بیت المقدس) پہنچے۔ وہاں آپ نے تمام انبیاء کی امامت فرمائی اور امام الانبیاء کا مقام پایا۔</p>

            <p><strong>معراج (آسمانوں کا سفر)</strong><br>
            بیت المقدس سے آپ ﷺ آسمانوں کی طرف تشریف لے گئے۔ ساتوں آسمانوں پر مختلف انبیاء (آدم، عیسیٰ، موسیٰ، ابراہیم علیہم السلام) سے ملاقات کی۔ آپ <em>سدرۃ المنتہیٰ</em> تک پہنچے جہاں مخلوق کی حد ختم ہوتی ہے۔ وہاں اللہ نے آپ سے کلام فرمایا اور پانچ وقت کی نماز کا تحفہ عطا کیا۔</p>

            <p><strong>نماز کا تحفہ</strong><br>
            یہ سفر اس بات کا ثبوت تھا کہ اگر زمین والے آپ کو رد کر رہے ہیں تو آسمان والے آپ کے منتظر ہیں۔ آپ ﷺ نماز کا تحفہ لے کر لوٹے، جو مومن کی معراج ہے تاکہ وہ دن میں پانچ بار اپنے رب سے مل سکے۔</p>
        `,
        lessons_ur: [
            "<strong>نماز کی اہمیت:</strong> نماز اتنی اہم عبادت ہے کہ اسے زمین پر نہیں بلکہ آسمانوں پر بلوا کر فرض کیا گیا۔",
            "<strong>مسجد اقصیٰ:</strong> مکہ اور بیت المقدس کا تعلق اسلام میں ابدی ہے۔",
            "<strong>عزت و بلندی:</strong> ہر مشکل (عسر) کے بعد آسانی (یسر) ہے۔ طائف کی ذلت کے بعد معراج کی عزت نصیب ہوئی۔"
        ],
        quote_ur: "پاک ہے وہ ذات جو اپنے بندے کو راتوں رات مسجد حرام سے مسجد اقصیٰ لے گئی..."
    },
    {
        id: "hijrah",
        year: "622 CE",
        age: "53 Years Old",
        icon: "bx-walk",

        title_en: "The Great Migration (Hijrah)",
        summary_en: "Leaving everything for Allah. The turning point that marked the beginning of the Islamic Calendar.",
        details_en: `
            <p><strong>The Plot</strong><br>
            The Quraysh, fearing the Prophet's growing influence, plotted to assassinate him. Representative youths from every tribe surrounded his house to strike him simultaneously. Allah informed the Prophet (ﷺ) of their plot. He asked Ali (RA) to sleep in his bed and cover himself with his green mantle.</p>

            <p><strong>The Escape</strong><br>
            Reciting the opening verses of Surah Yasin, the Prophet (ﷺ) walked right past the assassins, throwing dust towards them, yet they were blinded to his presence. He met his best friend Abu Bakr (RA) and they hid in the Cave of Thawr for three days. When the pursuers stood at the mouth of the cave, Abu Bakr whispered in fear, "If one of them looks down, he will see us." The Prophet smiled and said, "What do you think of two, of whom Allah is the third?"</p>

            <p><strong>Arrival in Madinah</strong><br>
            After a perilous journey, they reached Quba and then Madinah (Yathrib). The city erupted in joy. Men, women, and children climbed on rooftops singing <em>Tala'a Al-Badru 'Alayna</em> (The Full Moon has risen upon us). This event was so monumental it marked the start of the Islamic (Hijri) calendar—year 1 AH.</p>
        `,
        lessons_en: [
            "<strong>Tawakkul & Action:</strong> The Prophet took every precaution (hiding, changing routes) while trusting completely in Allah.",
            "<strong>Friendship:</strong> The loyalty of Abu Bakr (RA) teaches the value of rightful companionship ('Suhbah').",
            "<strong>Sacrifice:</strong> Faith sometimes requires leaving your comfort zone, your home, and your history for a greater purpose."
        ],
        quote_en: "If you do not help him, Allah has already helped him when those who disbelieved drove him out...",

        // Urdu Data
        title_ur: "ہجرتِ مدینہ",
        summary_ur: "اللہ کی خاطر سب کچھ چھوڑ دینا۔ وہ موڑ جس سے اسلامی تاریخ کا آغاز ہوا۔",
        details_ur: `
            <p><strong>قتل کی سازش</strong><br>
            قریش نے آپ ﷺ کے قتل کا منصوبہ بنایا۔ ہر قبیلے کے نوجوان نے آپ کے گھر کا گھیراؤ کر لیا۔ اللہ نے آپ کو خبر کر دی۔ آپ نے حضرت علی (رض) کو اپنے بستر پر لٹا دیا اور خود سورہ یٰسین کی تلاوت کرتے ہوئے کافروں کے درمیان سے نکل گئے، اور وہ آپ کو نہ دیکھ سکے۔</p>

            <p><strong>غارِ ثور</strong><br>
            آپ ﷺ اور حضرت ابوبکر صدیق (رض) تین دن غارِ ثور میں چھپے رہے۔ جب دشمن غار کے دہانے پر پہنچ گئے تو حضرت ابوبکر گھبرا گئے۔ آپ ﷺ نے فرمایا: "اے ابوبکر! ان دو کے بارے میں کیا خیال ہے جن کا تیسرا اللہ ہے؟" (لا تحزن ان اللہ معنا)۔</p>

            <p><strong>مدینہ آمد</strong><br>
            مشکل سفر کے بعد جب آپ مدینہ (یثرب) پہنچے تو پورا شہر خوشی سے جھوم اٹھا۔ لوگوں نے چھتوں پر چڑھ کر استقبال کیا اور <em>"طلع البدر علینا"</em> کے نعرے لگائے۔ یہ واقعہ اتنا اہم تھا کہ یہیں سے اسلامی کیلنڈر (ہجری سال) کا آغاز ہوا۔</p>
        `,
        lessons_ur: [
            "<strong>توکل اور تدبیر:</strong> اللہ پر بھروسہ کرنے کے ساتھ ساتھ ظاہری اسباب (تدبیر) اختیار کرنا سنتِ نبوی ہے۔",
            "<strong>دوستی:</strong> حضرت ابوبکر کی وفاداری سچی دوستی کی بہترین مثال ہے۔",
            "<strong>قربانی:</strong> بعض اوقات بڑے مقصد کے لیے اپنا گھر، آرام اور ماضی سب کچھ چھوڑنا پڑتا ہے۔"
        ],
        quote_ur: "اگر تم اس کی مدد نہ کرو گے تو اللہ اس کی مدد کر چکا ہے جب کافروں نے اسے نکال دیا تھا..."
    },
    {
        id: "fat'h",
        year: "630 CE",
        age: "61 Years Old",
        icon: "bx-flag",

        title_en: "The Conquest of Makkah",
        summary_en: "The triumphant return without bloodshed. 'Truth has come, and falsehood has vanished.'",
        details_en: `
            <p><strong>The Return</strong><br>
            Eight years after being forced to flee for his life, the Prophet (ﷺ) returned to Makkah—not as a refugee, but as the leader of 10,000 believers. The Quraysh, realizing they could not resist, surrendered. The Prophet entered the city with his head bowed so low in humility to Allah that his beard almost touched his saddle.</p>

            <p><strong>The General Amnesty</strong><br>
            The people of Makkah gathered at the Kaaba, waiting for their doom. They had tortured, killed, and starved the Muslims for years. The Prophet (ﷺ) asked, "What do you think I will do to you?" They pleaded, "You are a noble brother, son of a noble brother." He replied with the words of Prophet Yusuf: "No blame will there be upon you today. Go, for you are all free!"</p>

            <p><strong>Purifying the Kaaba</strong><br>
            He proceeded to the Kaaba and toppled the 360 idols surrounding it, reciting: <em>"Truth has come, and falsehood has vanished. Indeed falsehood is ever bound to vanish."</em> Makkah was purified for the worship of the One God forever.</p>
        `,
        lessons_en: [
            "<strong>Humility in Victory:</strong> Conquest did not bring arrogance; it brought him closer to the ground in Sajdah.",
            "<strong>Forgiveness:</strong> The general amnesty is unparalleled in history. Forgiveness conquers hearts where swords fail.",
            "<strong>Sanctity of Tauheed:</strong> The ultimate goal was establishing the Oneness of Allah and removing idolatry."
        ],
        quote_en: "Truth has (now) arrived, and Falsehood perished: for Falsehood is (by its nature) bound to perish.",

        // Urdu Data
        title_ur: "فتحِ مکہ",
        summary_ur: "بغیر خون بہائے عظیم فتح۔ 'حق آگیا اور باطل مٹ گیا'۔",
        details_ur: `
            <p><strong>فاتحانہ واپسی</strong><br>
            ہجرت کے آٹھ سال بعد، آپ ﷺ مکہ واپس لوٹے—ایک پناہ گزین کے طور پر نہیں بلکہ 10,000 کے لشکر کے سپہ سالار بن کر۔ آپ ﷺ عاجزی کے ساتھ شہر میں داخل ہوئے، سر مبارک اتنا جھکا ہوا تھا کہ کجاوے کو لگ رہا تھا۔</p>

            <p><strong>عام معافی</strong><br>
            قریشِ مکہ حرم میں جمع تھے، اپنی موت کے منتظر۔ انہوں نے مسلمانوں پر ظلم کے پہاڑ توڑے تھے۔ آپ ﷺ نے پوچھا: "تمہارا کیا خیال ہے میں تمہارے ساتھ کیا سلوک کروں گا؟" انہوں نے کہا: "آپ کریم بھائی ہیں اور کریم بھائی کے بیٹے ہیں۔" آپ ﷺ نے فرمایا: "آج تم پر کوئی ملامت نہیں۔ جاؤ تم سب آزاد ہو!"</p>

            <p><strong>بت شکنی</strong><br>
            پھر آپ ﷺ نے کعبہ کے گرد موجود 360 بتوں کو یہ کہتے ہوئے گرا دیا: <em>"جاء الحق و زھق الباطل"</em> (حق آگیا اور باطل مٹ گیا)۔ یوں مکہ ہمیشہ کے لیے توحید کا مرکز بن گیا۔</p>
        `,
        lessons_ur: [
            "<strong>عاجزی:</strong> فتح نے آپ میں غرور نہیں بلکہ اللہ کے لیے مزید عاجزی پیدا کی۔",
            "<strong>معافی:</strong> فتح مکہ پر عام معافی کی مثال تاریخ میں نہیں ملتی۔ انتقام کی بجائے درگزر سے دل جیتے جاتے ہیں۔",
            "<strong>توحید:</strong> اصل مقصد بت پرستی کا خاتمہ اور اللہ کی وحدانیت کا قیام تھا۔"
        ],
        quote_ur: "حق آگیا اور باطل مٹ گیا، بے شک باطل مٹنے ہی والا تھا۔"
    }
];

if (typeof window !== 'undefined') {
    window.SEERAH_DATA = SEERAH_DATA;
}
