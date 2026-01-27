/**
 * Duas Library - Authentic Supplications
 * Comprehensive Collection v2.1 (Maximized)
 */

const DUA_DATA = {
    'morning_evening': {
        title: 'Morning & Evening (Azkar)',
        icon: 'bx-sun',
        description: 'Essential daily protections to start and end your day with Barakah.',
        duas: [
            {
                id: 'me-1',
                arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
                translation_en: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
                translation_ur: 'ہم نے صبح کی اور اللہ کے لیے ہی بادشاہت ہے، اور تمام تعریفیں اللہ کے لیے ہیں۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں۔',
                reference: 'Sahih Muslim'
            },
            {
                id: 'me-2',
                arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا ، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
                translation_en: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.',
                translation_ur: 'اے اللہ! تیرے حکم سے ہم نے صبح کی اور تیرے حکم سے شام کی، تیرے ہی حکم سے ہم جیتے ہیں اور تیرے حکم سے مرتے ہیں اور تیری ہی طرف اٹھنا ہے۔',
                reference: 'Tirmidhi'
            },
            {
                id: 'me-3',
                arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
                translation_en: 'In the Name of Allah with Whose Name there is protection against every kind of harm in the earth or in the heaven, and He is the All-Hearing and All-Knowing. (Recite 3 times)',
                translation_ur: 'اللہ کے نام کے ساتھ جس کے نام کے ساتھ زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی اور وہ سننے والا جاننے والا ہے۔ (۳ بار)',
                reference: 'Abu Dawood'
            },
            {
                id: 'me-4',
                arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
                translation_en: 'O Allah, make me healthy in my body. O Allah, make me healthy in my hearing. O Allah, make me healthy in my sight. There is no deity but You. (Recite 3 times)',
                translation_ur: 'اے اللہ! مجھے میرے بدن میں عافیت دے، اے اللہ! مجھے میرے کانوں میں عافیت دے، اے اللہ! مجھے میری آنکھوں میں عافیت دے، تیرے سوا کوئی معبود نہیں۔',
                reference: 'Abu Dawood'
            },
            {
                id: 'me-5',
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
                translation_en: 'O Allah, I ask You for forgiveness and well-being in this world and in the Hereafter.',
                translation_ur: 'اے اللہ! میں تجھ سے دنیا اور آخرت میں معافی اور عافیت کا سوال کرتا ہوں۔',
                reference: 'Ibn Majah'
            }
        ]
    },
    'sabr': {
        title: 'Patience & Ease (Sabr)',
        icon: 'bx-heart',
        description: 'Supplications for times of hardship, anxiety, and seeking patience.',
        duas: [
            {
                id: 'sabr-1',
                arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
                translation_en: 'Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.',
                translation_ur: 'اے ہمارے رب! ہم پر صبر کے دہانے کھول دے اور ہمیں ثابت قدم رکھ اور ہمیں کافر لوگوں پر فتح عطا فرما۔',
                reference: 'Surah Al-Baqarah 2:250'
            },
            {
                id: 'sabr-2',
                arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
                translation_en: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
                translation_ur: 'ہمیں اللہ ہی کافی ہے اور وہ بہت اچھا کارساز ہے۔',
                reference: 'Surah Ali-Imran 3:173'
            },
            {
                id: 'sabr-3',
                arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
                translation_en: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
                translation_ur: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی ظالموں میں سے تھا۔',
                reference: 'Surah Al-Anbiya 21:87'
            },
            {
                id: 'sabr-4',
                arabic: 'إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ',
                translation_en: 'I only complain of my suffering and my grief to Allah.',
                translation_ur: 'میں اپنی پریشانی اور اپنے غم کی فریاد صرف اللہ ہی سے کرتا ہوں۔',
                reference: 'Surah Yusuf 12:86'
            },
            {
                id: 'sabr-5',
                arabic: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ',
                translation_en: 'Our Lord, and burden us not with that which we have no ability to bear.',
                translation_ur: 'اے ہمارے رب! اور ہم پر وہ بوجھ نہ ڈال جس کی ہم میں طاقت نہیں۔',
                reference: 'Surah Al-Baqarah 2:286'
            }
        ]
    },
    'protection': {
        title: 'Protection (Hifz)',
        icon: 'bx-shield-quarter',
        description: 'Seeking refuge from evil eye, magic, anxiety, and debt.',
        duas: [
            {
                id: 'prot-1',
                arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
                translation_en: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
                translation_ur: 'میں اللہ کے مکمل کلمات کی پناہ چاہتا ہوں ہر اس چیز کے شر سے جو اس نے پیدا کی ہے۔',
                reference: 'Sahih Muslim'
            },
            {
                id: 'prot-2',
                arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
                translation_en: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.',
                translation_ur: 'اے اللہ! میں تیری پناہ چاہتا ہوں فکر اور غم سے، ناتوانی اور سستی سے، بخل اور بزدلی سے، قرض کے بوجھ اور لوگوں کے تسلط سے۔',
                reference: 'Sahih Bukhari'
            },
            {
                id: 'prot-3',
                arabic: 'بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنٍ حَاسِدٍ',
                translation_en: 'In the Name of Allah I perform Ruqyah for you, from everything that is harming you, from the evil of every soul or envious eye.',
                translation_ur: 'اللہ کے نام سے میں تجھ پر دم کرتا ہوں، ہر اس چیز سے جو تجھے تکلیف دیتی ہے، ہر نفس کے شر سے یا حسد کرنے والی آنکھ سے۔',
                reference: 'Sahih Muslim'
            },
            {
                id: 'prot-4',
                arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ . مِن شَرِّ مَا خَلَقَ',
                translation_en: 'Say, "I seek refuge in the Lord of daybreak. From the evil of that which He created."',
                translation_ur: 'کہو کہ میں صبح کے رب کی پناہ مانگتا ہوں، ہر اس چیز کے شر سے جو اس نے پیدا کی۔',
                reference: 'Surah Al-Falaq'
            }
        ]
    },
    'anxiety': {
        title: 'Distress & Anxiety',
        icon: 'bx-brain',
        description: 'Prayers for mental peace and removal of worry.',
        duas: [
            {
                id: 'anx-1',
                arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
                translation_en: 'O Living, O Sustaining Provider, by Your Mercy I seek assistance.',
                translation_ur: 'اے زندہ اور قائم رہنے والے! میں تیری رحمت کے واسطے سے فریاد کرتا ہوں۔',
                reference: 'Tirmidhi'
            },
            {
                id: 'anx-2',
                arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
                translation_en: 'My Lord, expand for me my breast [with assurance] and ease for me my task.',
                translation_ur: 'اے میرے رب! میرا سینہ میرے لیے کھول دے اور میرے کام کو میرے لیے آسان کر دے۔',
                reference: 'Surah Taha 20:25-26'
            },
            {
                id: 'anx-3',
                arabic: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ',
                translation_en: 'O Allah, I hope for Your mercy. Do not leave me to myself even for the blinking of an eye. Correct all of my affairs for me.',
                translation_ur: 'اے اللہ! میں تیری رحمت کا امیدوار ہوں، پس مجھے پل بھر کے لیے بھی میرے نفس کے سپرد نہ کر، اور میرے تمام معاملات درست فرما۔',
                reference: 'Abu Dawood'
            },
            {
                id: 'anx-4',
                arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
                translation_en: 'Unquestionably, by the remembrance of Allah hearts are assured.',
                translation_ur: 'خبردار! اللہ کے ذکر سے ہی دلوں کو اطمینان نصیب ہوتا ہے۔',
                reference: 'Surah Ar-Ra’d 13:28'
            }
        ]
    },
    'rizq': {
        title: 'Sustenance (Rizq)',
        icon: 'bx-wallet',
        description: 'Prayers for increase in provision and barakah.',
        duas: [
            {
                id: 'rizq-1',
                arabic: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
                translation_en: 'And He will provide him from (sources) he could not imagine. And whoever relies upon Allah - then He is sufficient for him.',
                translation_ur: 'اور اسے وہاں سے رزق دے گا جہاں سے اس کا گمان بھی نہ ہو، اور جو اللہ پر بھروسہ کرے تو وہ اسے کافی ہے۔',
                reference: 'Surah At-Talaq 65:3'
            },
            {
                id: 'rizq-2',
                arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
                translation_en: 'O Allah! Suffice me with Your lawful against Your prohibited, and make me independent of all those besides You.',
                translation_ur: 'اے اللہ! مجھے اپنے حلال کے ذریعے اپنے حرام سے کفایت عطا فرما، اور اپنے فضل سے اپنے سوا ہر کسی سے بے پروا کر دے۔',
                reference: 'Tirmidhi'
            },
            {
                id: 'rizq-3',
                arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
                translation_en: 'My Lord, indeed I am, for whatever good You would send down to me, in need.',
                translation_ur: 'اے میرے رب! جو بھی بھلائی تو میری طرف اتارے، میں اس کا محتاج ہوں۔',
                reference: 'Surah Al-Qasas 28:24'
            },
            {
                id: 'rizq-4',
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
                translation_en: 'O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds.',
                translation_ur: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور مقبول عمل کا سوال کرتا ہوں۔',
                reference: 'Ibn Majah'
            }
        ]
    },
    'shifa': {
        title: 'Healing (Shifa)',
        icon: 'bx-plus-medical',
        description: 'Supplications for health and cure from illness.',
        duas: [
            {
                id: 'shifa-1',
                arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شَافِيَ إِلاَّ أَنْتَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
                translation_en: 'O Allah, Lord of mankind, do away with the suffering. Heal as You are the only Healer and there is no cure except that of Yours, it is that which leaves no ailment behind.',
                translation_ur: 'اے اللہ! لوگوں کے رب! تکلیف کو دور فرما، شفا عطا فرما، تو ہی شفا دینے والا ہے، تیری شفا کے سوا کوئی شفا نہیں، ایسی شفا عطا کر کہ کوئی بیماری باقی نہ رہے۔',
                reference: 'Sahih Bukhari'
            },
            {
                id: 'shifa-2',
                arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
                translation_en: 'Indeed, adversity has touched me, and you are the Most Merciful of the merciful.',
                translation_ur: 'مجھے بیماری لگ گئی ہے اور تو سب سے زیادہ رحم کرنے والا ہے۔',
                reference: 'Surah Al-Anbiya 21:83'
            },
            {
                id: 'shifa-3',
                arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
                translation_en: 'I ask Allah, the Mighty, the Lord of the Mighty Throne, to cure you. (Recite 7 times)',
                translation_ur: 'میں عظمت والے اللہ، جو عظیم عرش کا رب ہے، سے سوال کرتا ہوں کہ وہ تجھے شفا دے۔ (۷ بار)',
                reference: 'Tirmidhi'
            }
        ]
    },
    'parents': {
        title: 'Parents (Walidain)',
        icon: 'bx-user-plus',
        description: 'Dua for the health, forgiveness, and mercy of parents.',
        duas: [
            {
                id: 'par-1',
                arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
                translation_en: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
                translation_ur: 'اے میرے رب! ان دونوں پر رحم فرما جیسا کہ انہوں نے بچپن میں میری پرورش کی۔',
                reference: 'Surah Al-Isra 17:24'
            },
            {
                id: 'par-2',
                arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا',
                translation_en: 'My Lord, forgive me and my parents and whoever enters my house a believer.',
                translation_ur: 'اے میرے رب! مجھے اور میرے والدین کو بخش دے اور جو میرے گھر میں ایمان کی حالت میں داخل ہو۔',
                reference: 'Surah Nuh 71:28'
            },
            {
                id: 'par-3',
                arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
                translation_en: 'Our Lord, forgive me and my parents and the believers the Day the account is established.',
                translation_ur: 'اے ہمارے رب! مجھے بخش دے اور میرے والدین کو اور مومنوں کو جس دن حساب قائم ہوگا۔',
                reference: 'Surah Ibrahim 14:41'
            }
        ]
    },
    'safar': {
        title: 'Travel (Safar)',
        icon: 'bx-car',
        description: 'Duas for safe journey and protection while travelling.',
        duas: [
            {
                id: 'safar-1',
                arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
                translation_en: 'Glory to Him who has subjected this to us, and we could not have [otherwise] subdued it. And indeed we, to our Lord, will return.',
                translation_ur: 'پاک ہے وہ ذات جس نے اس سواری کو ہمارے بس میں کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور یقیناً ہم اپنے رب ہی کی طرف لوٹنے والے ہیں۔',
                reference: 'Surah Az-Zukhruf 43:13-14'
            },
            {
                id: 'safar-2',
                arabic: 'أَسْتَوْدِعُ اللَّهَ دِينَكُمْ وَأَمَانَتَكُمْ وَخَوَاتِيمَ أَعْمَالِكُمْ',
                translation_en: 'I entrust to Allah your religion, your trusts, and the final deeds of your actions.',
                translation_ur: 'میں تمہارا دین، تمہاری امانتیں اور تمہارے اعمال کے خاتمے اللہ کے سپرد کرتا ہوں۔',
                reference: 'Abu Dawood'
            },
            {
                id: 'safar-3',
                arabic: 'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
                translation_en: 'O Allah, make this journey ours easy for us, and shorten its distance for us.',
                translation_ur: 'اے اللہ! ہمارے لیے ہمارا یہ سفر آسان کر دے اور اس کی دوری کو ہم پر لپیٹ دے (کم کر دے)۔',
                reference: 'Sahih Muslim'
            }
        ]
    },
    'mercy': {
        title: 'Forgiveness & Mercy',
        icon: 'bx-leaf',
        description: 'Seeking Allah’s forgiveness and mercy.',
        duas: [
            {
                id: 'mercy-1',
                arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                translation_en: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
                translation_ur: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا۔',
                reference: 'Surah Al-Baqarah 2:201'
            },
            {
                id: 'mercy-2',
                arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
                translation_en: 'O Allah, You are Forgiving and love forgiveness, so forgive me.',
                translation_ur: 'اے اللہ! تو معاف کرنے والا ہے، معافی کو پسند کرتا ہے، لہذا مجھے معاف فرما۔',
                reference: 'Tirmidhi'
            },
            {
                id: 'mercy-3',
                arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
                translation_en: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
                translation_ur: 'اے ہمارے رب! ہم نے اپنی جانوں پر ظلم کیا، اور اگر تو نے ہمیں معاف نہ کیا اور ہم پر رحم نہ کیا تو ہم یقیناً نقصان اٹھانے والوں میں سے ہو جائیں گے۔',
                reference: 'Surah Al-A’raf 7:23'
            }
        ]
    },
    'knowledge': {
        title: 'Knowledge (Ilm)',
        icon: 'bx-book-open',
        description: 'Prayers for studying, exams, and wisdom.',
        duas: [
            {
                id: 'ilm-1',
                arabic: 'رَّبِّ زِدْنِي عِلْمًا',
                translation_en: 'My Lord, increase me in knowledge.',
                translation_ur: 'اے میرے رب! میرے علم میں اضافہ فرما۔',
                reference: 'Surah Taha 20:114'
            },
            {
                id: 'ilm-2',
                arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا',
                translation_en: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.',
                translation_ur: 'اے اللہ! جو تو نے مجھے سکھایا اس سے مجھے نفع دے، اور مجھے وہ سکھا جو مجھے نفع دے، اور میرے علم میں اضافہ فرما۔',
                reference: 'Ibn Majah'
            },
            {
                id: 'ilm-3',
                arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
                translation_en: 'My Lord, expand for me my breast, ease my task for me, and untie the knot from my tongue so that they understand my speech.',
                translation_ur: 'اے میرے رب! میرا سینہ کھول دے، میرا کام آسان کر دے، اور میری زبان کی گرہ کھول دے تا کہ وہ میری بات سمجھ سکیں۔',
                reference: 'Surah Taha 20:25-28'
            }
        ]
    },
    'guidance': {
        title: 'Guidance (Hidayah)',
        icon: 'bx-compass',
        description: 'Supplications for staying on the righteous path.',
        duas: [
            {
                id: 'hid-1',
                arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
                translation_en: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.',
                translation_ur: 'اے ہمارے رب! ہمارے دلوں کو ٹیڑھا نہ ہونے دے اس کے بعد کہ تو نے ہمیں ہدایت دی، اور ہمیں اپنی طرف سے رحمت عطا فرما۔',
                reference: 'Surah Ali-Imran 3:8'
            },
            {
                id: 'hid-2',
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
                translation_en: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
                translation_ur: 'اے اللہ! میں تجھ سے ہدایت، تقویٰ، پاکدامنی اور بے نیازی کا سوال کرتا ہوں۔',
                reference: 'Sahih Muslim'
            },
            {
                id: 'hid-3',
                arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
                translation_en: 'Guide us to the straight path.',
                translation_ur: 'ہمیں سیدھے راستے کی ہدایت دے۔',
                reference: 'Surah Al-Fatiha 1:6'
            }
        ]
    }
};

if (typeof window !== 'undefined') {
    window.DUA_DATA = DUA_DATA;
}
