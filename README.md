# 🎙️ BhashaBuddy: VoiceBridge Jam
### *A Bilingual Technical English Learning Web Application for Engineering Students*

> **Problem Context:** Engineering students from rural and vernacular-medium educational backgrounds face acute linguistic barriers when transitioning to English-medium curricula and placement interviews. Traditional apps teach conversational travel phrases and assume English baseline literacy, without vernacular explanations or phonetic speech practice.  
> **Solution:** **BhashaBuddy** uses native regional languages (**Telugu, Hindi, and Tamil**) as the medium of instruction to teach technical English vocabulary through interactive 3D flashcards, real-time speech recognition pronunciation scoring, daily micro-lessons, and a bilingual contextual chatbot.

---

## 🚀 Key Modules & System Features

### Core Modules (Must-Have)
1. **Bilingual Regional Interface & Concept Explanations**
   - Full UI switching between **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, **Tamil (தமிழ்)**, and **English**.
   - React Context API / LanguageManager for dynamic reactive localization.
2. **Technical Vocabulary Deck (50+ Engineering Terms)**
   - Progressive engineering units: *Computer Fundamentals, Programming Languages, Data Structures, Database Systems, Computer Networks, Artificial Intelligence, Engineering Mathematics*.
   - Phonetic pronunciation guides, definitions, and contextual engineering sentences.
3. **Interactive 3D Flashcards**
   - Interactive flip animation: English term on front; vernacular translation, definition, and engineering example on back.
   - Normal and slow (0.8x) pronunciation playback, shuffle, domain filters, and keyboard shortcuts (`Spacebar` to flip, `Arrow Keys` to navigate).
4. **Text-to-Speech (TTS) Pronunciation System**
   - Integrated with browser **Web Speech Synthesis API**.
   - Native English audio playback with syllable-level pacing (1.0x and 0.8x slow rate).
5. **Speech Recognition & Pronunciation Evaluator (VoiceBridge Studio)**
   - Integrated with browser **Web Speech Recognition API** (`webkitSpeechRecognition`).
   - Captures microphone input, computes string similarity using the **Levenshtein Distance Algorithm**, and awards a 0–100% score.
   - **Vernacular Accent Tolerance**: Implements fuzzy relaxation ($\le 2$ edit distance) to prevent false rejections of regional accents.
   - **Text Fallback**: Fallback simulator for browsers with restricted microphone permissions.
6. **Daily Interactive Vocabulary Quiz**
   - Bilingual multiple-choice drills (English to Vernacular and Vernacular to English).
   - Instant feedback with regional language explanations and score tallying.
7. **Daily Goal & Progress Tracker**
   - Configurable daily word goals (e.g., 5 words/day), streak meter, and cumulative mastered words.
   - Persists state in **SQLite** and **LocalStorage**.

### Stretch Features (Implemented)
8. **Vernacular-to-English Contextual Chatbot**
   - AI Study Buddy capable of answering student technical doubts in Telugu, Hindi, Tamil, and English with code snippets and interview advice.
9. **Visual Pictorial Dictionary**
   - Interactive SVG schematics for abstract concepts (Stack LIFO, Queue FIFO, Trees, RDBMS keys, Network topologies).
10. **Offline Audio & Resource Caching**
    - Service Worker (`sw.js`) and PWA Web App Manifest (`manifest.json`) for low-bandwidth rural connectivity.

---

## 🛠️ Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | HTML5, Modern ES6+, Tailwind CSS (CDN) | Responsive, mobile-first student UI |
| **Localization** | LanguageContext (Telugu, Hindi, Tamil, English) | State-driven translation engine |
| **Backend** | Node.js (v20+ / v26) | High-performance application runtime |
| **Database** | SQLite (`node:sqlite` Native Sync Engine) | `bhashabuddy.db` storing profiles, words, logs, and scores |
| **Speech Input** | Browser Web Speech Recognition API | Captures spoken English via microphone |
| **Speech Output** | Browser Web Speech Synthesis API | Native English pronunciation playback |
| **Evaluation Algorithm** | Levenshtein Distance Metric | Phonetic string similarity calculation |

---

## 📐 Pronunciation Evaluation Algorithm

The similarity score is calculated using the **Levenshtein Distance Metric**:

$$\text{Score} = \left(1 - \frac{D}{L}\right) \times 100$$

Where:
- $D$ = Levenshtein edit distance (insertions, deletions, substitutions).
- $L = \max(\text{len}(\text{targetWord}), \text{len}(\text{spokenWord}))$.

**Regional Accent Tolerance:** If $D \le 2$ and raw score $\ge 70\%$, a $+10\%$ accent compensation bonus is applied to accommodate mother-tongue influence (MTI).

---

## 🗄️ Database Architecture

The SQLite database (`database/bhashabuddy.db`) implements four normalized tables:

1. **`UserProfiles`**: `user_id`, `name`, `email`, `password_hash`, `language`, `daily_goal`, `streak`, `created_at`
2. **`VocabularyUnits`**: `word_id`, `english_word`, `phonetic_guide`, `telugu_meaning`, `hindi_meaning`, `tamil_meaning`, `definition`, `example_sentence`, `category`, `difficulty`, `icon_type`
3. **`ProgressLogs`**: `log_id`, `user_id`, `completed_words`, `daily_goal`, `learning_date`, `streak`
4. **`PronunciationScores`**: `score_id`, `user_id`, `word_id`, `target_word`, `recognized_text`, `match_score`, `feedback`, `attempt_date`

---

## 🌐 Deployment Options

### 1. Local Deployment (Active)
The server is currently running locally:
```bash
node backend/server.js
# Or
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### 2. Vercel Deployment
Pre-configured with `vercel.json`:
```bash
npx vercel
```

### 3. Render.com Deployment
Pre-configured with `render.yaml`. Connect your GitHub repository to Render and deploy as a Web Service.

### 4. Docker Containerization
```bash
docker build -t bhashabuddy .
docker run -p 5000:5000 bhashabuddy
```

3. **Live Demonstration Workflow:**
   1. Switch language to **తెలుగు (Telugu)** or **हिन्दी (Hindi)** using the top-right selector.
   2. Open **Flashcards** and press `Spacebar` to flip and study the word **Algorithm** (`[AL-guh-rith-um]`).
   3. Click **"Practice in Voice Lab"** (or switch to the **Voice Lab** tab).
   4. Click **"Listen Normal (1.0x)"** to hear the correct English pronunciation.
   5. Click the **Microphone button**, pronounce the word *"Algorithm"*, and watch the real-time Levenshtein evaluation score and celebratory confetti!
   6. Take the **Daily Quiz** to reinforce your knowledge.
   7. Open **Study Buddy** and ask: *"What is a pointer?"* or *"రికర్శన్ అంటే ఏమిటి?"*.
