/**
 * Asma-ul-Husna Data
 * The 99 Beautiful Names of Allah
 */

const NAMES_DATA = [
    {
        "no": 1,
        "ar": "الرَّحْمَنُ",
        "en": "Ar-Rahman",
        "mean": "The Entirely Merciful",
        "desc": "He who wills goodness and mercy for all His creatures.",
        "benefit": "Reciting this 100 times after every mandatory prayer will invoke memory, keen awareness, and be freed from the heaviness of heart."
    },
    {
        "no": 2,
        "ar": "الرَّحِيمُ",
        "en": "Ar-Rahim",
        "mean": "The Especially Merciful",
        "desc": "He who acts with extreme kindness.",
        "benefit": "Reciting this 100 times after Fajr prayer will find safety from the afflictions of the world."
    },
    {
        "no": 3,
        "ar": "الْمَلِكُ",
        "en": "Al-Malik",
        "mean": "The King",
        "desc": "The Sovereign Lord, The One with the complete Dominion, the One Whose Dominion is clear from imperfection.",
        "benefit": "Reciting this name frequently produces intellect and wisdom."
    },
    {
        "no": 4,
        "ar": "الْقُدُّوسُ",
        "en": "Al-Quddus",
        "mean": "The Perfectly Holy",
        "desc": "The One who is pure from any imperfection and clear from children and adversaries.",
        "benefit": "Reciting this 100 times every day will be free from anxiety."
    },
    {
        "no": 5,
        "ar": "السَّلاَمُ",
        "en": "As-Salam",
        "mean": "The Source of Peace",
        "desc": "The One who is free from every imperfection.",
        "benefit": "Reciting this 160 times to a sick person will help them regain health."
    },
    {
        "no": 6,
        "ar": "الْمُؤْمِنُ",
        "en": "Al-Mu'min",
        "mean": "The Bestower of Safety",
        "desc": "The One who witnessed for Himself that no one is God but Him. And He witnessed for His believers that they are truthful in their belief that no one is God but Him.",
        "benefit": "Reciting this name 631 times will grant protection from harm."
    },
    {
        "no": 7,
        "ar": "الْمُهَيْمِنُ",
        "en": "Al-Muhaymin",
        "mean": "The Guardian",
        "desc": "The One who witnesses the saying and deeds of His creatures.",
        "benefit": "Reciting this name 100 times after bath and two rakaats of prayer helps in purification of soul."
    },
    {
        "no": 8,
        "ar": "الْعَزِيزُ",
        "en": "Al-Aziz",
        "mean": "The Almighty",
        "desc": "The Strong, The Defeater who is not defeated.",
        "benefit": "Reciting this name 40 times after Fajr for 40 days will result in wealth and honor."
    },
    {
        "no": 9,
        "ar": "الْجَبَّارُ",
        "en": "Al-Jabbar",
        "mean": "The Compeller",
        "desc": "The One that nothing happens in His Dominion except that which He willed.",
        "benefit": "Reciting this name helps to prevent violence, severity or hardness."
    },
    {
        "no": 10,
        "ar": "الْمُتَكَبِّرُ",
        "en": "Al-Mutakabbir",
        "mean": "The Supreme",
        "desc": "The One who is clear from the attributes of the creatures and from resembling them.",
        "benefit": "Reciting this name before intercourse causes the righteous child."
    },
    {
        "no": 11,
        "ar": "الْخَالِقُ",
        "en": "Al-Khaliq",
        "mean": "The Creator",
        "desc": "The One who brings everything from non-existence to existence.",
        "benefit": "Reciting this name at night creates an angel."
    },
    {
        "no": 12,
        "ar": "الْبَارِئُ",
        "en": "Al-Bari",
        "mean": "The Evolver",
        "desc": "The Maker, The Creator who has the power to turn the entities.",
        "benefit": "Reciting this name helps in creating a child."
    },
    {
        "no": 13,
        "ar": "الْمُصَوِّرُ",
        "en": "Al-Musawwir",
        "mean": "The Fashioner",
        "desc": "The One who forms His creatures in different pictures.",
        "benefit": "Recite this name 21 times and breathe over water and give it to the barren woman to drink, she will be blessed with a child."
    },
    {
        "no": 14,
        "ar": "الْغَفَّارُ",
        "en": "Al-Ghaffar",
        "mean": "The Constant Forgiver",
        "desc": "The Forgiver, The One who forgives the sins of His slaves time and time again.",
        "benefit": "He who recites this name will be forgiven of his sins."
    },
    {
        "no": 15,
        "ar": "الْقَهَّارُ",
        "en": "Al-Qahhar",
        "mean": "The Subduer",
        "desc": "The Dominant, The One who has the perfect Power and is not unable over anything.",
        "benefit": "Reciting this name helps to overcome the desires of the flesh and the world."
    },
    {
        "no": 16,
        "ar": "الْوَهَّابُ",
        "en": "Al-Wahhab",
        "mean": "The Bestower",
        "desc": "The One who is Generous in giving plenty without any return.",
        "benefit": "Reciting this name frequently will remove poverty."
    },
    {
        "no": 17,
        "ar": "الرَّزَّاقُ",
        "en": "Ar-Razzaq",
        "mean": "The Provider",
        "desc": "The Sustainer, The Provider.",
        "benefit": "Reciting this name will be provided with sustenance."
    },
    {
        "no": 18,
        "ar": "الْفَتَّاحُ",
        "en": "Al-Fattah",
        "mean": "The Opener",
        "desc": "The Opener, The Reliever, The Judge, The One who opens for His slaves the closed worldly and religious matters.",
        "benefit": "The heart of him who recites this name will be open, and he will be given victory."
    },
    {
        "no": 19,
        "ar": "الْعَلِيمُ",
        "en": "Al-Alim",
        "mean": "The All-Knowing",
        "desc": "The Knowledgeable; The One nothing is absent from His knowledge.",
        "benefit": "He who recites this name, his heart will become luminous, revealing divine light."
    },
    {
        "no": 20,
        "ar": "الْقَابِضُ",
        "en": "Al-Qabid",
        "mean": "The Withholder",
        "desc": "The Constrictor, The Withholder, The One who constricts the sustenance.",
        "benefit": "He who writes this name on 4 pieces of food (fruit, bread, etc.) and eats them for 40 days will be free from hunger."
    },
    {
        "no": 21,
        "ar": "الْبَاسِطُ",
        "en": "Al-Basit",
        "mean": "The Extender",
        "desc": "The Expander, The Munificent.",
        "benefit": "He who recites this name 10 times after Fajr prayer towards the heavens with open hands will be free from need."
    },
    {
        "no": 22,
        "ar": "الْخَافِضُ",
        "en": "Al-Khafid",
        "mean": "The Reducer",
        "desc": "The Abaser, The One who lowers whoever He willed by His Destruction.",
        "benefit": "Those who fast three days and on the fourth day recite this name 70 times in a gathering, Allah will free them from harm by their enemy."
    },
    {
        "no": 23,
        "ar": "الرَّافِعُ",
        "en": "Ar-Rafi",
        "mean": "The Exalter",
        "desc": "The Exalter, The Elevator, The One who lowers whoever He willed by His Endownment.",
        "benefit": "He who recites this name 101 times day and night, Allah will make him higher, as far as honor, richness and merit are concerned."
    },
    {
        "no": 24,
        "ar": "الْمُعِزُّ",
        "en": "Al-Mu'izz",
        "mean": "The Honorer",
        "desc": "The Giver of Honors, The One who gives esteem to whoever He willed, hence there is no one to degrade Him.",
        "benefit": "He who recites this name 140 times after Maghrib prayer on Monday or Friday nights, Allah will make him fearless."
    },
    {
        "no": 25,
        "ar": "الْمُذِلُّ",
        "en": "Al-Mudhill",
        "mean": "The Humiliator",
        "desc": "The Dishonorer, The Humiliator, The One who degrades whoever He willed, hence there is no one to give Him esteem.",
        "benefit": "He who recites this name 75 times will be free from harm."
    },
    {
        "no": 26,
        "ar": "السَّمِيعُ",
        "en": "As-Sami",
        "mean": "The All-Hearing",
        "desc": "The Hearer, The One who Hears all things that are heard by His Eternal Hearing without an ear, instrument or organ.",
        "benefit": "He who recites this name 500 times, 100 times or 50 times on Thursday after offering Chasht prayer, his prayer will be answered."
    },
    {
        "no": 27,
        "ar": "الْبَصِيرُ",
        "en": "Al-Basir",
        "mean": "The All-Seeing",
        "desc": "The All-Noticing, The One who Sees all things that are seen by His Eternal Seeing without an eye, instrument or organ.",
        "benefit": "He who recites this name 100 times after Friday afternoon prayer, Allah will give this person light in his sight and enlighten his heart."
    },
    {
        "no": 28,
        "ar": "الْحَكَمُ",
        "en": "Al-Hakam",
        "mean": "The Judge",
        "desc": "The Judge, The Arbitrator, The One who always delivers justice in every situation.",
        "benefit": "He who recites this name 99 times while in the state of Wudu at night, Allah will remove every grief from his heart."
    },
    {
        "no": 29,
        "ar": "الْعَدْلُ",
        "en": "Al-Adl",
        "mean": "The Just",
        "desc": "The Just, The One who is entitled to do what He does.",
        "benefit": "On Friday night or day, if you write this name on a piece of bread and eat it, people will obey you."
    },
    {
        "no": 30,
        "ar": "اللَّطِيفُ",
        "en": "Al-Latif",
        "mean": "The Subtle One",
        "desc": "The Subtle One, The Gracious, The One who is kind to His slaves and endows upon them.",
        "benefit": "He who recites this name 133 times daily will have increase in his sustenance and all his affairs will be settled to his satisfaction."
    },
    {
        "no": 31,
        "ar": "الْخَبِيرُ",
        "en": "Al-Khabir",
        "mean": "The All-Aware",
        "desc": "The Awake, The One who knows the truth of things.",
        "benefit": "Reciting this name regularly will make you a righteous person."
    },
    {
        "no": 32,
        "ar": "الْحَلِيمُ",
        "en": "Al-Halim",
        "mean": "The Forbearing",
        "desc": "The Forbearing, The One who sends no punishment immediately.",
        "benefit": "He who writes this name on a piece of paper, washes it with water and sprinkles that water on anything that he loves, his love will be reciprocated."
    },
    {
        "no": 33,
        "ar": "الْعَظِيمُ",
        "en": "Al-Azim",
        "mean": "The Magnificent",
        "desc": "The Great, The One who is deserving the attributes of Exaltment, Glory, Extolment, and Purity from all imperfection.",
        "benefit": "Those who recite this name frequently will be respected."
    },
    {
        "no": 34,
        "ar": "الْغَفُورُ",
        "en": "Al-Ghafur",
        "mean": "The Forgiving",
        "desc": "The All-Forgiving, The Forgiving, The One who forgives a lot.",
        "benefit": "He who has a headache, fever or is sorrowful, and continuously recites this name, will be relieved of his ailment and will have his sorrow removed."
    },
    {
        "no": 35,
        "ar": "الشَّكُورُ",
        "en": "Ash-Shakur",
        "mean": "The Appreciative",
        "desc": "The Grateful, The Appreciative, The One who gives a lot of reward for a little obedience.",
        "benefit": "He who is heavy-hearted and recites this name 41 times will differ sensation of relief."
    },
    {
        "no": 36,
        "ar": "الْعَلِيُّ",
        "en": "Al-Ali",
        "mean": "The Most High",
        "desc": "The Highest, The One who is clear from the attributes of the creatures.",
        "benefit": "He who recites this name frequently will be given things he never thought possible."
    },
    {
        "no": 37,
        "ar": "الْكَبِيرُ",
        "en": "Al-Kabir",
        "mean": "The Very Great",
        "desc": "The Great, The One who is greater than everything in status.",
        "benefit": "He who recites this name 100 times a day will have esteem."
    },
    {
        "no": 38,
        "ar": "الْحَفِيظُ",
        "en": "Al-Hafiz",
        "mean": "The Preserver",
        "desc": "The Preserver, The Protector, The One who protects whatever and whoever He willed to protect.",
        "benefit": "He who recites this name frequently and keeps it with him will be protected against calamities."
    },
    {
        "no": 39,
        "ar": "الْمُقِيتُ",
        "en": "Al-Muqit",
        "mean": "The Sustainer",
        "desc": "The Maintainer, The Guardian, The Feeder, The One who has the Power.",
        "benefit": "He who recites this name on a glass of water and gives it to a bad mannered child, it will help the child in having good manners."
    },
    {
        "no": 40,
        "ar": "الْحَسِيبُ",
        "en": "Al-Hasib",
        "mean": "The Reckoner",
        "desc": "The Reckoner, The One who gives the satisfaction.",
        "benefit": "He who faces any problem should repeat this name, Allah will remove his difficulty."
    },
    {
        "no": 41,
        "ar": "الْجَلِيلُ",
        "en": "Al-Jalil",
        "mean": "The Majestic",
        "desc": "The Sublime One, The Beneficent, The One who is attributed with greatness of Power and Glory of status.",
        "benefit": "He who writes this name on a piece of paper with musk and saffron and keeps it with him and washes it and drinks the water, will be revered among men."
    },
    {
        "no": 42,
        "ar": "الْكَرِيمُ",
        "en": "Al-Karim",
        "mean": "The Generous",
        "desc": "The Bountiful, The Generous, The One who is attributed with greatness of Power and Glory of status.",
        "benefit": "He who recites this name frequently will have esteem in this world."
    },
    {
        "no": 43,
        "ar": "الرَّقِيبُ",
        "en": "Ar-Raqib",
        "mean": "The Watchful",
        "desc": "The Watchful, The One that nothing is absent from Him. Hence its meaning is related to the attribute of Knowledge.",
        "benefit": "He who recites this name 7 times on himself, his family and property, all will be under Allah;s protection."
    },
    {
        "no": 44,
        "ar": "الْمُجِيبُ",
        "en": "Al-Mujib",
        "mean": "The Responsive",
        "desc": "The Responsive, The Hearkener, The One who answers the one in need if he asks Him and rescues the yearner if he calls upon Him.",
        "benefit": "Reciting this name will fulfill appeals."
    },
    {
        "no": 45,
        "ar": "الْوَاسِعُ",
        "en": "Al-Wasi",
        "mean": "The All-Encompassing",
        "desc": "The Vast, The All-Embracing, The Knowledgeable.",
        "benefit": "He who has difficulty in earning, should recite this name frequently, will have good earnings."
    },
    {
        "no": 46,
        "ar": "الْحَكِيمُ",
        "en": "Al-Hakim",
        "mean": "The Wise",
        "desc": "The Wise, The Judge of Judges, The One who is correct in His doings.",
        "benefit": "He who recites this name continuously (from time to time) will not have difficulties in his work, and Allah will open to him the door of wisdom."
    },
    {
        "no": 47,
        "ar": "الْوَدُودُ",
        "en": "Al-Wadud",
        "mean": "The Loving",
        "desc": "The One who loves His believing slaves and His believing slaves love Him.",
        "benefit": "Reciting this 1000 times on food and consuming it with your spouse helps in resolving differences."
    },
    {
        "no": 48,
        "ar": "الْمَجِيدُ",
        "en": "Al-Majid",
        "mean": "The Glorious",
        "desc": "The Most Glorious One, The One who is with perfect Power, High Status, Compassion, Generosity and Kindness.",
        "benefit": "He who recites this name will be granted glory."
    },
    {
        "no": 49,
        "ar": "الْبَاعِثُ",
        "en": "Al-Ba'ith",
        "mean": "The Resurrecting",
        "desc": "The Resurrector, The Raiser (from death), The One who resurrects His slaves after death for reward and/or punishment.",
        "benefit": "He who recites this name 100 times before sleeping will not be afraid of anything."
    },
    {
        "no": 50,
        "ar": "الشَّهِيدُ",
        "en": "Ash-Shahid",
        "mean": "The Witness",
        "desc": "The Witness, The One who nothing is absent from Him.",
        "benefit": "He who has a disobedient child or wife and repeats this name 21 times with his hand on his/her forehead, Allah will incline his/her character for the better."
    },
    {
        "no": 51,
        "ar": "الْحَقُّ",
        "en": "Al-Haqq",
        "mean": "The Truth",
        "desc": "The Truth, The True, The One who truly exists.",
        "benefit": "He who recites this name will get his lost thing back."
    },
    {
        "no": 52,
        "ar": "الْوَكِيلُ",
        "en": "Al-Wakil",
        "mean": "The Trustee",
        "desc": "The Trustee, The One who gives the satisfaction and is relied upon.",
        "benefit": "He who is afraid of drowning, being burnt in a fire, or any similar danger, and recites this name continuously (from time to time), will be under the protection of Allah."
    },
    {
        "no": 53,
        "ar": "الْقَوِيُّ",
        "en": "Al-Qawiyy",
        "mean": "The Powerful",
        "desc": "The Most Strong, The Strong, The One with the complete Power.",
        "benefit": "He who cannot defeat his enemy, and repeats this name with the intention of not being harmed, will be free from his enemy's harm."
    },
    {
        "no": 54,
        "ar": "الْمَتِينُ",
        "en": "Al-Matin",
        "mean": "The Firm",
        "desc": "The One with extreme Power which is un-interrupted and He does not get tired.",
        "benefit": "He who has troubles and recites this name will get rid of his troubles."
    },
    {
        "no": 55,
        "ar": "الْوَلِيُّ",
        "en": "Al-Wali",
        "mean": "The Friend",
        "desc": "The Protecting Friend, The Supporter.",
        "benefit": "He who recites this name is likely to be a walyullah, the friend of Allah."
    },
    {
        "no": 56,
        "ar": "الْحَمِيدُ",
        "en": "Al-Hamid",
        "mean": "The Praiseworthy",
        "desc": "The Praiseworthy, The lauded One who deserves to be praised.",
        "benefit": "He who recites this name will be loved and praised."
    },
    {
        "no": 57,
        "ar": "الْمُحْصِي",
        "en": "Al-Muhsi",
        "mean": "The Accounter",
        "desc": "The Counter, The Reckoner, The One who the count of things are known to him.",
        "benefit": "He who is afraid of being questioned on the Judgment Day, and repeats this name 100 times daily, will have ease and clement."
    },
    {
        "no": 58,
        "ar": "الْمُبْدِئُ",
        "en": "Al-Mubdi",
        "mean": "The Originator",
        "desc": "The Originator, The One who started the human being.",
        "benefit": "Reciting this 1000 times will help in making a decision when undecided."
    },
    {
        "no": 59,
        "ar": "الْمُعِيدُ",
        "en": "Al-Mu'id",
        "mean": "The Restorer",
        "desc": "The Reproducer, The One who brings back the creatures after death.",
        "benefit": "Reciting this 70 times will help in the safe return of a missing person."
    },
    {
        "no": 60,
        "ar": "الْمُحْيِي",
        "en": "Al-Muhyi",
        "mean": "The Giver of Life",
        "desc": "The Restorer, The Giver of Life, The One who took out a living human from semen that does not have a soul.",
        "benefit": "He who has a heavy burden and repeats this name 7 times daily, will have his burden taken away."
    },
    {
        "no": 61,
        "ar": "الْمُمِيتُ",
        "en": "Al-Mumit",
        "mean": "The Taker of Life",
        "desc": "The Creator of Death, The Destroyer, The One who renders the living dead.",
        "benefit": "This name helps in destroying one's enemy."
    },
    {
        "no": 62,
        "ar": "الْحَيُّ",
        "en": "Al-Hayy",
        "mean": "The Ever-Living",
        "desc": "The Alive, The One attributed with a life that is unlike our life and is not that of a combination of soul, flesh or blood.",
        "benefit": "He who recites this name will have a long life."
    },
    {
        "no": 63,
        "ar": "الْقَيُّومُ",
        "en": "Al-Qayyum",
        "mean": "The Self-Subsisting",
        "desc": "The Self-Subsisting, The One who remains and does not end.",
        "benefit": "He who recites this name will not fall into inadvertency."
    },
    {
        "no": 64,
        "ar": "الْوَاجِدُ",
        "en": "Al-Wajid",
        "mean": "The Finder",
        "desc": "The Perceiver, The Finder, The Rich who is never poor.",
        "benefit": "He who recites this name will have richness of heart."
    },
    {
        "no": 65,
        "ar": "الْمَاجِدُ",
        "en": "Al-Majid",
        "mean": "The Noble",
        "desc": "The Illustrious, The Magnificent, The Glorious.",
        "benefit": "He who recites this name, his heart will be enlightened."
    },
    {
        "no": 66,
        "ar": "الْوَاحِدُ",
        "en": "Al-Wahid",
        "mean": "The One",
        "desc": "The Unique, The One, The One without a partner.",
        "benefit": "He who recites this name 1000 times in seclusion will become free from fear and delusion."
    },
    {
        "no": 67,
        "ar": "الْأَحَد",
        "en": "Al-Ahad",
        "mean": "The Only One",
        "desc": "The One, The Only One.",
        "benefit": "Reciting this name 1000 times will open certain secrets."
    },
    {
        "no": 68,
        "ar": "الصَّمَدُ",
        "en": "As-Samad",
        "mean": "The Eternal Satisfier",
        "desc": "The Eternal, The Independent, The Master who is relied upon in matters and reverted to in ones needs.",
        "benefit": "He who recites this name frequently will be helped in need."
    },
    {
        "no": 69,
        "ar": "الْقَادِرُ",
        "en": "Al-Qadir",
        "mean": "The Capable",
        "desc": "The Able, The Capable, The One attributed with Power.",
        "benefit": "Reciting this name helps in fulfilling ones desires."
    },
    {
        "no": 70,
        "ar": "الْمُقْتَدِرُ",
        "en": "Al-Muqtadir",
        "mean": "The Powerful",
        "desc": "The Dominant, The One with the perfect Power that nothing is withheld from Him.",
        "benefit": "He who recites this name will wake up at his desired time."
    },
    {
        "no": 71,
        "ar": "الْمُقَدِّمُ",
        "en": "Al-Muqaddim",
        "mean": "The Expediter",
        "desc": "The Promoter, The One who puts things in their right places.",
        "benefit": "He who recites this name on the battlefield, or who has fear of being alone in an awe-inspiring place, no harm will come to him."
    },
    {
        "no": 72,
        "ar": "الْمُؤَخِّرُ",
        "en": "Al-Mu'akhkhir",
        "mean": "The Delayer",
        "desc": "The Delayer, The Retarder, The One who puts things in their right places.",
        "benefit": "Reciting this name 100 times helps to love only Allah."
    },
    {
        "no": 73,
        "ar": "الْأَوَّلُ",
        "en": "Al-Awwal",
        "mean": "The First",
        "desc": "The First, The One whose Existence is without a beginning.",
        "benefit": "He who recites this name 40 times for 40 days will be given a child."
    },
    {
        "no": 74,
        "ar": "الْآخِرُ",
        "en": "Al-Akhir",
        "mean": "The Last",
        "desc": "The Last, The One whose Existence is without an end.",
        "benefit": "He who recites this name frequently will lead a good life and at the end of this life will have a good death."
    },
    {
        "no": 75,
        "ar": "الظَّاهِرُ",
        "en": "Az-Zahir",
        "mean": "The Manifest",
        "desc": "The Manifest, The One that nothing is above Him and nothing is underneath Him.",
        "benefit": "He who recites this name 15 times after Friday prayer, divine light will enter his heart."
    },
    {
        "no": 76,
        "ar": "الْبَاطِنُ",
        "en": "Al-Batin",
        "mean": "The Hidden",
        "desc": "The Hidden, The One that nothing is above Him and nothing is underneath Him.",
        "benefit": "He who recites this name 3 times every day will be able to see the truth in things."
    },
    {
        "no": 77,
        "ar": "الْوَالِي",
        "en": "Al-Wali",
        "mean": "The Governor",
        "desc": "The Governor, The One who owns things and manages them.",
        "benefit": "He who recites this name and breathes it into his house, his house will be free from danger."
    },
    {
        "no": 78,
        "ar": "الْمُتَعَالِ",
        "en": "Al-Muta'ali",
        "mean": "The Most Exalted",
        "desc": "The Most Exalted, The High Exalted, The One who is clear from the attributes of the creation.",
        "benefit": "He who recites this name frequently will gain the benevolence of Allah."
    },
    {
        "no": 79,
        "ar": "الْبَرُّ",
        "en": "Al-Barr",
        "mean": "The Source of Goodness",
        "desc": "The Source of All Goodness, The Righteous, The One who is kind to His creatures.",
        "benefit": "He who recites this name to his child, this child will be free from misfortune."
    },
    {
        "no": 80,
        "ar": "التَّوَّابُ",
        "en": "At-Tawwab",
        "mean": "The Acceptor of Repentance",
        "desc": "The Relenting, The One who grants repentance to whoever He willed among His creatures.",
        "benefit": "He who recites this name frequently, his repentance will be accepted."
    },
    {
        "no": 81,
        "ar": "الْمُنْتَقِمُ",
        "en": "Al-Muntaqim",
        "mean": "The Avenger",
        "desc": "The Avenger, The One who victoriously prevails over His enemies and punishes them for their sins.",
        "benefit": "He who recites this name frequently will be victorious against his enemies."
    },
    {
        "no": 82,
        "ar": "الْعَفُوُّ",
        "en": "Al-Afuww",
        "mean": "The Pardoner",
        "desc": "The Forgiver, The One with wide forgiveness.",
        "benefit": "He who recites this name frequently will have his sins forgiven."
    },
    {
        "no": 83,
        "ar": "الرَّؤُوفُ",
        "en": "Ar-Ra'uf",
        "mean": "The Most Kind",
        "desc": "The Compassionate, The One with extreme Mercy.",
        "benefit": "He who recites this name frequently will be blessed."
    },
    {
        "no": 84,
        "ar": "مَالِكُ الْمُلْكِ",
        "en": "Malik-ul-Mulk",
        "mean": "Master of Dominion",
        "desc": "The Master of the Kingdom, The Owner of All Sovereignty.",
        "benefit": "He who recites this name will have esteem among people."
    },
    {
        "no": 85,
        "ar": "ذُو الْجَلاَلِ وَالْإِكْرَامِ",
        "en": "Zul-Jalal wal-Ikram",
        "mean": "Lord of Majesty and Generosity",
        "desc": "The Lord of Majesty and Generosity, The One who is attributed with greatness of Power and Glory of status.",
        "benefit": "He who recites this name frequently will be given honour and dignity."
    },
    {
        "no": 86,
        "ar": "الْمُقْسِطُ",
        "en": "Al-Muqsit",
        "mean": "The Equitable",
        "desc": "The Equitable, The One who gives every one his due.",
        "benefit": "He who recites this name will be free from the harm of the devil."
    },
    {
        "no": 87,
        "ar": "الْجَامِعُ",
        "en": "Al-Jami",
        "mean": "The Gatherer",
        "desc": "The Gatherer, The One who gathers the creatures on a day that there is no doubt about, that is the Day of Judgment.",
        "benefit": "He who recites this name will find legitimate things which he lost."
    },
    {
        "no": 88,
        "ar": "الْغَنِيُّ",
        "en": "Al-Ghaniyy",
        "mean": "The Self-Sufficient",
        "desc": "The One who does not need the creation.",
        "benefit": "He who recites this name will be contented and not covetous."
    },
    {
        "no": 89,
        "ar": "الْمُغْنِي",
        "en": "Al-Mughni",
        "mean": "The Enricher",
        "desc": "The Enricher, The One who satisfies the necessities of the creatures.",
        "benefit": "He who recites this name 10 times for 10 Fridays will become self-sufficient."
    },
    {
        "no": 90,
        "ar": "الْمَانِعُ",
        "en": "Al-Mani",
        "mean": "The Withholder",
        "desc": "The Withholder.",
        "benefit": "He who recites this name will have a good family life."
    },
    {
        "no": 91,
        "ar": "الضَّارُّ",
        "en": "Ad-Darr",
        "mean": "The Distressor",
        "desc": "The One who makes harm reach to whoever He willed.",
        "benefit": "He who recites this name will be safe from harmful things."
    },
    {
        "no": 92,
        "ar": "النَّافِعُ",
        "en": "An-Nafi",
        "mean": "The Benefactor",
        "desc": "The Propitious, The One who makes benefits reach to whoever He willed.",
        "benefit": "He who recites this name 4 days continuously will be safe from all harm."
    },
    {
        "no": 93,
        "ar": "النُّورُ",
        "en": "An-Nur",
        "mean": "The Light",
        "desc": "The Light, The One who guides.",
        "benefit": "He who recites this name will have inner light."
    },
    {
        "no": 94,
        "ar": "الْهَادِي",
        "en": "Al-Hadi",
        "mean": "The Guide",
        "desc": "The Guide, The One whom with His Guidance His believers were guided.",
        "benefit": "He who recites this name frequently will have spiritual knowledge."
    },
    {
        "no": 95,
        "ar": "الْبَدِيعُ",
        "en": "Al-Badi",
        "mean": "The Incomparable Originator",
        "desc": "The Incomparable, The Unattainable, The One who created the creation and formed it without any preceding example.",
        "benefit": "He who recites this name 70 times will be free from all troubles."
    },
    {
        "no": 96,
        "ar": "الْبَاقِي",
        "en": "Al-Baqi",
        "mean": "The Everlasting",
        "desc": "The Everlasting, The One that the state of non-existence is impossible for Him.",
        "benefit": "He who recites this name every Friday night will be accepted by people."
    },
    {
        "no": 97,
        "ar": "الْوَارِثُ",
        "en": "Al-Warith",
        "mean": "The Inheritor",
        "desc": "The Heir, The One whose Existence remains.",
        "benefit": "He who recites this name will have long life."
    },
    {
        "no": 98,
        "ar": "الرَّشِيدُ",
        "en": "Ar-Rashid",
        "mean": "The Guide to Right Path",
        "desc": "The Guide to the Right Path, The One who guides.",
        "benefit": "He who recites this name 1000 times between Maghrib and Isha Prayer will have his troubles removed."
    },
    {
        "no": 99,
        "ar": "الصَّبُورُ",
        "en": "As-Sabur",
        "mean": "The Patient",
        "desc": "The Patient, The One who does not quickly punish the sinners.",
        "benefit": "He who recites this name 3000 times will be rescued from any difficulty."
    }
];

if (typeof window !== 'undefined') {
    window.NAMES_DATA = NAMES_DATA;
}
