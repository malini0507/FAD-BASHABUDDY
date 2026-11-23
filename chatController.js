const db = require('../models/database');

/**
 * Vernacular-to-English Engineering Learning Chatbot
 * Answers student questions with dual-language technical explanations.
 */
function handleChatMessage(message, language = 'te') {
  if (!message || message.trim() === '') {
    return {
      reply: "Hello! Ask me any technical question in English, Telugu, Hindi, or Tamil.",
      language
    };
  }

  const query = message.toLowerCase().trim();

  // Search if the query matches a technical vocabulary word in our database
  const words = db.prepare('SELECT * FROM VocabularyUnits').all();
  let matchedWord = null;

  for (const w of words) {
    const eng = w.english_word.toLowerCase();
    if (query.includes(eng) || eng.includes(query)) {
      matchedWord = w;
      break;
    }
  }

  // Pre-configured engineering concept responses with bilingual translations
  const faqPatterns = [
    {
      keywords: ["difference between compiler and interpreter", "compiler vs interpreter", "కంపైలర్"],
      response: {
        en: "A **Compiler** translates the entire source code into machine code at once before execution (e.g., C, C++). An **Interpreter** translates and executes the code line-by-line (e.g., Python). Compilers generate faster executables, while interpreters make debugging easier.",
        te: "**కంపైలర్:** పూర్తి కోడ్‌ను ఒకేసారి మెషిన్ కోడ్‌గా మారుస్తుంది (ఉదాహరణ: C++). **ఇంటర్‌ప్రిటర్:** కోడ్‌ను ఒక్కో లైనుగా చదివి అమలు చేస్తుంది (ఉదాహరణ: Python).",
        hi: "**कंपाइलर:** पूरे कोड को एक साथ मशीन कोड में बदलता है। **इंटरप्रेटर:** कोड को पंक्ति-दर-पंक्ति अनुवादित और निष्पादित करता है।"
      }
    },
    {
      keywords: ["interview", "placement", "introduce myself", "ఇంటర్వ్యూ", "పరిచయం"],
      response: {
        en: "Here is a simple template to introduce yourself in technical interviews: *'Good morning Sir/Madam, my name is [Name]. I am pursuing B.Tech in [Branch] at [College]. My core technical strengths are Data Structures, Python, and Web Development. I recently built BhashaBuddy to solve regional language barriers in engineering education.'*",
        te: "ఇంటర్వ్యూ చిట్కా: మీ పరిచయాన్ని ఆత్మవిశ్వాసంతో ప్రారంభించండి. మీ ప్రాజెక్ట్ గురించి స్పష్టమైన ఆంగ్ల పదాలను వాడండి: *'I have built a full-stack bilingual project using React and Node.js.'*",
        hi: "साक्षात्कार सुझाव: आत्मविश्वास से बोलें और अपनी तकनीकी परियोजनाओं (जैसे BhashaBuddy) का उल्लेख करें।"
      }
    },
    {
      keywords: ["recursion", "రికర్శన్", "పునరావృత్తి"],
      response: {
        en: "**Recursion** is when a function calls itself directly or indirectly to solve smaller instances of the same problem. Crucial rule: Always have a **base condition** to avoid an infinite loop and stack overflow!",
        te: "**రికర్శన్:** సమస్యను చిన్న భాగాలుగా పరిష్కరించడానికి ఒక ఫంక్షన్ తనను తాను మళ్లీ మళ్లీ పిలుచుకోవడం. స్టాక్ ఓవర్‌ఫ్లో కాకుండా ఉండటానికి తప్పనిసరిగా 'Base Condition' ఉండాలి.",
        hi: "**रिकर्शन:** जब कोई फ़ंक्शन स्वयं को कॉल करता है। स्टैक ओवरफ़्लो से बचने के लिए 'बेस कंडीशन' आवश्यक है।"
      }
    },
    {
      keywords: ["pointer", "పాయింటర్"],
      response: {
        en: "A **Pointer** in C/C++ is a variable that stores the memory address of another variable. For example: `int a = 10; int *p = &a;` Here `*p` refers to the memory location of `a`.",
        te: "**పాయింటర్:** మరొక వేరియబుల్ యొక్క మెమరీ చిరునామా (Address)ను నిల్వ చేసే వేరియబుల్. C లాంగ్వేజ్‌లో మెమరీ నిర్వహణకు ఇది అత్యంత ముఖ్యం.",
        hi: "**पॉइंटर:** वह चर जो किसी अन्य चर का मेमोरी पता रखता है।"
      }
    }
  ];

  for (const item of faqPatterns) {
    if (item.keywords.some(k => query.includes(k))) {
      let regional = item.response[language] || item.response.te;
      return {
        replyEn: item.response.en,
        replyRegional: regional,
        foundInFAQ: true
      };
    }
  }

  // If a vocabulary word matched
  if (matchedWord) {
    let regionalMeaning = matchedWord.telugu_meaning;
    if (language === 'hi') regionalMeaning = matchedWord.hindi_meaning;
    if (language === 'ta') regionalMeaning = matchedWord.tamil_meaning;

    return {
      replyEn: `**${matchedWord.english_word}** (${matchedWord.phonetic_guide}): ${matchedWord.definition}\n\n*Example in Engineering:* "${matchedWord.example_sentence}"`,
      replyRegional: `**స్థానిక అర్థం (${language.toUpperCase()}):** ${regionalMeaning}`,
      targetWord: matchedWord.english_word,
      phonetic: matchedWord.phonetic_guide
    };
  }

  // General encouraging fallback
  const genericReplies = {
    te: {
      en: `Great question! In technical English, remember that engineering concepts become easy when you break terms into syllables and practice active speaking. You can also search for this word in our Vocabulary Deck.`,
      regional: `మీ ప్రశ్నకు ధన్యవాదాలు! ఇంజనీరింగ్ పదాలను నేర్చుకోవడానికి 'Vocabulary' ట్యాబ్‌లో శోధించండి లేదా మైక్రోఫోన్ ద్వారా మాట్లాడటం సాధన చేయండి.`
    },
    hi: {
      en: `Great question! Focus on clear pronunciation and understanding the core engineering definition. Check our Vocabulary Deck to practice this concept with voice!`,
      regional: `धन्यवाद! तकनीकी शब्दावली को समझने के लिए हमारे 'Vocabulary Deck' में देखें और माइक से बोलने का अभ्यास करें।`
    },
    ta: {
      en: `Great question! Practicing technical English definitions aloud builds confidence for placement interviews.`,
      regional: `நன்றி! தொழில்நுட்ப ஆங்கிலத்தை பேசப் பழக எங்கள் 'Vocabulary Deck' ஐப் பயன்படுத்தவும்.`
    }
  };

  const fallback = genericReplies[language] || genericReplies.te;
  return {
    replyEn: fallback.en,
    replyRegional: fallback.regional,
    isGeneric: true
  };
}

module.exports = { handleChatMessage };
