/**
 * LanguageContext: Exhaustive bilingual localization strings
 * Supported: English (en), Telugu (te), Hindi (hi), Tamil (ta)
 */

const UI_STRINGS = {
  en: {
    appName: "BhashaBuddy",
    tagline: "VoiceBridge Jam – Bilingual Technical English for Engineering Students",
    navDashboard: "Dashboard",
    navVocabulary: "Vocabulary Deck",
    navFlashcards: "Flashcards",
    navPronunciation: "Voice Lab",
    navQuiz: "Daily Quiz",
    navVisualDict: "Visual Dictionary",
    navChatbot: "Study Buddy",
    navAnalytics: "My Progress",
    navPeerChallenge: "Peer Lab",
    dailyGoal: "Daily Goal",
    streakDays: "Days Streak",
    wordsLearned: "Words Mastered",
    accuracyRate: "Speech Accuracy",
    welcomeTitle: "Empower Your Technical English",
    welcomeSub: "Bridge the gap between vernacular medium education and engineering success. Learn, listen, speak, and master core concepts bilingually.",
    startPractice: "Start Daily Practice",
    listenAudio: "Listen",
    listenSentence: "Listen Sentence",
    listenSlow: "Slow (0.75x)",
    speakNow: "Tap to Speak",
    listening: "Listening to your voice...",
    processing: "Evaluating Pronunciation with Levenshtein Algorithm...",
    scoreLabel: "Pronunciation Score",
    flipCard: "Click card or press Space to flip",
    markMastered: "Mark as Learned",
    categoryAll: "All Engineering Domains",
    difficultyAll: "All Difficulties",
    searchPlaceholder: "Search engineering terms (e.g. Algorithm, Recursion, Database)...",
    quizTitle: "Daily Technical English Quiz",
    quizSub: "Reinforce technical vocabulary with interactive bilingual assessments.",
    submitQuiz: "Next Question",
    finishQuiz: "View Results & Tally Score",
    tryAgain: "Take Another Quiz",
    chatTitle: "Bilingual Technical Assistant",
    chatSub: "Ask engineering doubts in English, Telugu, Hindi, or Tamil.",
    chatPlaceholder: "Ask a doubt (e.g., What is recursion? / పాయింటర్ అంటే ఏమిటి?)...",
    send: "Send",
    myVoiceRecord: "Play My Spoken Voice",
    compareAudio: "Compare with Native TTS",
    accentToleranceNote: "Regional Accent Tolerance Applied (Levenshtein distance <= 2)",
    offlineReady: "Offline Mode Ready (Cached for low internet)",
    filterDomain: "Filter by Domain",
    allLevels: "All Levels"
  },
  te: {
    appName: "భాషాబడ్డీ (BhashaBuddy)",
    tagline: "వాయిస్‌బ్రిడ్జ్ జామ్ – ఇంజనీరింగ్ విద్యార్థుల కోసం ద్విభాషా సాంకేతిక ఆంగ్ల అభ్యాసం",
    navDashboard: "డాష్‌బోర్డ్",
    navVocabulary: "పదకోశం",
    navFlashcards: "ఫ్లాష్‌కార్డులు",
    navPronunciation: "వాయిస్ ల్యాబ్",
    navQuiz: "రోజువారీ క్విజ్",
    navVisualDict: "విజువల్ డిక్షనరీ",
    navChatbot: "స్టడీ బడ్డీ",
    navAnalytics: "నా ప్రగతి",
    navPeerChallenge: "పీర్ ప్రాక్టీస్",
    dailyGoal: "నేటి లక్ష్యం",
    streakDays: "రోజుల స్ట్రీక్",
    wordsLearned: "నేర్చుకున్న పదాలు",
    accuracyRate: "ఉచ్చారణ ఖచ్చితత్వం",
    welcomeTitle: "సాంకేతిక ఆంగ్లంలో ప్రావీణ్యం పొందండి",
    welcomeSub: "తెలుగు మాధ్యమం నుండి ఇంజనీరింగ్‌కు మారిన విద్యార్థుల కోసం ప్రత్యేకంగా రూపొందించబడింది. స్థానిక భాషా వివరణలు మరియు వాయిస్ ప్రాక్టీస్‌తో ఆత్మవిశ్వాసాన్ని పెంచుకోండి.",
    startPractice: "నేటి అభ్యాసాన్ని ప్రారంభించండి",
    listenAudio: "పదం వినండి",
    listenSentence: "వాక్యం వినండి",
    listenSlow: "నెమ్మదిగా (0.75x)",
    speakNow: "మైక్‌తో మాట్లాడండి",
    listening: "వింటోంది... మాట్లాడండి",
    processing: "లెవెన్‌స్టీన్ అల్గారిథమ్‌తో ఉచ్చారణను లెక్కిస్తోంది...",
    scoreLabel: "ఉచ్చారణ స్కోరు",
    flipCard: "అర్థం కోసం కార్డును క్లిక్ చేయండి లేదా Spacebar నొక్కండి",
    markMastered: "నేర్చుకున్నట్లు గుర్తించండి",
    categoryAll: "అన్ని ఇంజనీరింగ్ విభాగాలు",
    difficultyAll: "అన్ని స్థాయిలు",
    searchPlaceholder: "ఇంజనీరింగ్ పదాలను శోధించండి (ఉదా: Algorithm, Recursion, Database)...",
    quizTitle: "రోజువారీ సాంకేతిక ఆంగ్ల క్విజ్",
    quizSub: "ద్విభాషా ప్రశ్నలతో మీ అవగాహనను పరీక్షించుకోండి.",
    submitQuiz: "తదుపరి ప్రశ్న",
    finishQuiz: "ఫలితాలను చూడండి",
    tryAgain: "మరో క్విజ్ ప్రయత్నించండి",
    chatTitle: "ద్విభాషా సాంకేతిక సహాయకుడు",
    chatSub: "తెలుగు లేదా ఆంగ్లంలో మీ సాంకేతిక సందేహాలను అడగండి.",
    chatPlaceholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి (ఉదా: What is recursion? / రికర్శన్ అంటే ఏమిటి?)...",
    send: "పంపండి",
    myVoiceRecord: "నా రికార్డ్ చేసిన వాయిస్ వినండి",
    compareAudio: "నేటివ్ ఆడియోతో సరిపోల్చండి",
    accentToleranceNote: "ప్రాంతీయ యాస సడలింపు వర్తింపజేయబడింది (Levenshtein distance <= 2)",
    offlineReady: "ఆఫ్‌లైన్ మోడ్ సిద్ధంగా ఉంది (నెట్ లేకున్నా పనిచేస్తుంది)",
    filterDomain: "విభాగం వారీగా ఎంచుకోండి",
    allLevels: "అన్ని స్థాయిలు"
  },
  hi: {
    appName: "भाषाबडी (BhashaBuddy)",
    tagline: "वॉइसब्रिज जैम – इंजीनियरिंग छात्रों के लिए द्विभाषी तकनीकी अंग्रेजी",
    navDashboard: "डैशबोर्ड",
    navVocabulary: "शब्दावली डेक",
    navFlashcards: "फ्लैशकार्ड्स",
    navPronunciation: "वॉइस लैब",
    navQuiz: "दैनिक क्विज़",
    navVisualDict: "दृश्य शब्दकोश",
    navChatbot: "स्टडी बडी",
    navAnalytics: "मेरी प्रगति",
    navPeerChallenge: "सहपाठी अभ्यास",
    dailyGoal: "दैनिक लक्ष्य",
    streakDays: "दिनों का स्ट्रीक",
    wordsLearned: "सीखे गए शब्द",
    accuracyRate: "उच्चारण सटीकता",
    welcomeTitle: "तकनीकी अंग्रेजी में आत्मविश्वास पाएं",
    welcomeSub: "हिंदी माध्यम के छात्रों के लिए इंजीनियरिंग शब्दावली, सही उच्चारण और साक्षात्कार की तैयारी को आसान बनाएं।",
    startPractice: "दैनिक अभ्यास शुरू करें",
    listenAudio: "शब्द सुनें",
    listenSentence: "वाक्य सुनें",
    listenSlow: "धीमी गति (0.75x)",
    speakNow: "माइक में बोलें",
    listening: "सुन रहा है... बोलिए",
    processing: "लेवेनश्टीन एल्गोरिदम से मूल्यांकन जारी है...",
    scoreLabel: "उच्चारण स्कोर",
    flipCard: "अर्थ देखने के लिए क्लिक करें या Space दबाएं",
    markMastered: "सीखा हुआ चिह्नित करें",
    categoryAll: "सभी इंजीनियरिंग डोमेन",
    difficultyAll: "सभी स्तर",
    searchPlaceholder: "इंजीनियरिंग शब्द खोजें (उदा: Algorithm, Recursion, Database)...",
    quizTitle: "दैनिक तकनीकी अंग्रेजी क्विज़",
    quizSub: "द्विभाषी प्रश्नों के साथ अपने ज्ञान का परीक्षण करें।",
    submitQuiz: "अगला प्रश्न",
    finishQuiz: "परिणाम देखें",
    tryAgain: "पुनः प्रयास करें",
    chatTitle: "द्विभाषी तकनीकी सहायक",
    chatSub: "हिंदी या अंग्रेजी में अपनी शंकाएं पूछें।",
    chatPlaceholder: "यहाँ अपना प्रश्न लिखें (उदा: What is recursion? / रिकर्शन क्या है?)...",
    send: "भेजें",
    myVoiceRecord: "मेरी रिकॉर्ड की गई आवाज सुनें",
    compareAudio: "मूल ऑडियो से तुलना करें",
    accentToleranceNote: "क्षेत्रीय उच्चारण छूट लागू की गई (Levenshtein distance <= 2)",
    offlineReady: "ऑफ़लाइन मोड सक्रिय (कम इंटरनेट में भी सक्षम)",
    filterDomain: "डोमेन चुनें",
    allLevels: "सभी स्तर"
  },
  ta: {
    appName: "பாஷாபடி (BhashaBuddy)",
    tagline: "வாய்ஸ்பிரிட்ஜ் ஜாம் – பொறியியல் மாணவர்களுக்கான இருமொழித் தொழில்நுட்ப ஆங்கிலம்",
    navDashboard: "டாஷ்போர்டு",
    navVocabulary: "சொல்லகராதி",
    navFlashcards: "அட்டைப்பயிற்சி",
    navPronunciation: "குரல் கூடம்",
    navQuiz: "தினசரி வினாடிவினா",
    navVisualDict: "காட்சி அகராதி",
    navChatbot: "படிப்புத் தோழன்",
    navAnalytics: "எனது முன்னேற்றம்",
    navPeerChallenge: "தோழர் பயிற்சி",
    dailyGoal: "இன்றைய இலக்கு",
    streakDays: "தொடர் நாட்கள்",
    wordsLearned: "கற்ற சொற்கள்",
    accuracyRate: "உச்சரிப்புத் துல்லியம்",
    welcomeTitle: "தொழில்நுட்ப ஆங்கிலத்தில் சிறந்து விளங்குங்கள்",
    welcomeSub: "தமிழ் வழிப் பொறியியல் மாணவர்கள் எளிதாக தொழில்நுட்ப ஆங்கிலம் மற்றும் சரியான உச்சரிப்பைக் கற்றுக்கொள்ள உதவும் தளம்.",
    startPractice: "இன்றைய பயிற்சியைத் தொடங்கு",
    listenAudio: "சொல் கேட்க",
    listenSentence: "வாக்கியம் கேட்க",
    listenSlow: "மெதுவாக (0.75x)",
    speakNow: "மைக் மூலம் பேசவும்",
    listening: "கேட்கிறது... பேசவும்",
    processing: "மதிப்பீடு செய்கிறது...",
    scoreLabel: "உச்சரிப்பு மதிப்பெண்",
    flipCard: "பொருளைக் காண அட்டையைத் தொடவும் அல்லது Space அழுத்தவும்",
    markMastered: "கற்றதாகக் குறிக்கவும்",
    categoryAll: "அனைத்து பொறியியல் துறைகளும்",
    difficultyAll: "அனைத்து நிலைகளும்",
    searchPlaceholder: "சொற்களைத் தேடுங்கள்...",
    quizTitle: "தினசரி வினாடிவினா",
    quizSub: "இருமொழி வினாக்கள் மூலம் உங்களை சோதிக்கவும்.",
    submitQuiz: "அடுத்த கேள்வி",
    finishQuiz: "முடிவுகளைக் காண்க",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    chatTitle: "இருமொழி உதவித் தோழன்",
    chatSub: "தமிழிலோ ஆங்கிலத்திலோ உங்கள் ஐயங்களைக் கேளுங்கள்.",
    chatPlaceholder: "உங்கள் கேள்வியை தட்டச்சு செய்யவும்...",
    send: "அனுப்பு",
    myVoiceRecord: "எனது பதிவு செய்த குரல்",
    compareAudio: "ஆடியோ ஒப்பீடு",
    accentToleranceNote: "வட்டார உச்சரிப்பு சலுகை அளிக்கப்பட்டது",
    offlineReady: "ஆஃப்லைன் முறை தயார்",
    filterDomain: "துறை வாரியாக",
    allLevels: "அனைத்து நிலைகளும்"
  }
};

class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('bhashabuddy_lang') || 'te';
    this.listeners = [];
  }

  getLang() {
    return this.currentLanguage;
  }

  setLang(lang) {
    if (UI_STRINGS[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('bhashabuddy_lang', lang);
      this.notifyListeners();
      fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      }).catch(err => console.log('Sync lang error:', err));
    }
  }

  t(key) {
    const langObj = UI_STRINGS[this.currentLanguage] || UI_STRINGS.en;
    return langObj[key] || UI_STRINGS.en[key] || key;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    for (const cb of this.listeners) {
      cb(this.currentLanguage);
    }
  }
}

window.LangManager = new LanguageManager();
