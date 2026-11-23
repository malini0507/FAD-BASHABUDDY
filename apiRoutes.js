const { getAllVocabulary, getVocabularyById, getCategories, getDailyDeck } = require('../controllers/vocabularyController');
const { evaluatePronunciation } = require('../controllers/pronunciationController');
const { getUserProgress, incrementCompletedWord, updateLanguage } = require('../controllers/progressController');
const { handleChatMessage } = require('../controllers/chatController');
const db = require('../models/database');

function handleApiRequest(req, res, pathname, query, postData) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // 1. GET /api/vocabulary/categories
    if (req.method === 'GET' && pathname === '/api/vocabulary/categories') {
      const categories = getCategories();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: categories }));
      return;
    }

    // 2. GET /api/vocabulary/daily
    if (req.method === 'GET' && pathname === '/api/vocabulary/daily') {
      const words = getDailyDeck(5);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: words }));
      return;
    }

    // 3. GET /api/vocabulary/:id
    const singleMatch = pathname.match(/^\/api\/vocabulary\/(\d+)$/);
    if (req.method === 'GET' && singleMatch) {
      const id = parseInt(singleMatch[1], 10);
      const word = getVocabularyById(id);
      if (!word) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: 'Word not found' }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: word }));
      return;
    }

    // 4. GET /api/vocabulary (all with filters)
    if (req.method === 'GET' && pathname === '/api/vocabulary') {
      const category = query.get('category') || 'All';
      const difficulty = query.get('difficulty') || 'All';
      const search = query.get('search') || '';
      const list = getAllVocabulary({ category, difficulty, search });
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: list.length, data: list }));
      return;
    }

    // 5. POST /api/pronunciation/evaluate
    if (req.method === 'POST' && pathname === '/api/pronunciation/evaluate') {
      const body = postData || {};
      const { targetWord, spokenText, userId, wordId } = body;
      const result = evaluatePronunciation(targetWord, spokenText, userId || 1, wordId || null);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: result }));
      return;
    }

    // 6. GET /api/progress
    if (req.method === 'GET' && (pathname === '/api/progress' || pathname.startsWith('/api/progress/'))) {
      const userId = 1;
      const progress = getUserProgress(userId);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: progress }));
      return;
    }

    // 7. POST /api/progress/complete-word
    if (req.method === 'POST' && pathname === '/api/progress/complete-word') {
      const updated = incrementCompletedWord(1);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: updated }));
      return;
    }

    // 8. POST /api/user/language
    if (req.method === 'POST' && pathname === '/api/user/language') {
      const body = postData || {};
      const updated = updateLanguage(1, body.language || 'te');
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: updated }));
      return;
    }

    // 9. POST /api/chat
    if (req.method === 'POST' && pathname === '/api/chat') {
      const body = postData || {};
      const response = handleChatMessage(body.message, body.language || 'te');
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: response }));
      return;
    }

    // 10. GET /api/quiz
    if (req.method === 'GET' && pathname === '/api/quiz') {
      const language = query.get('lang') || 'te';
      const allWords = db.prepare('SELECT * FROM VocabularyUnits ORDER BY RANDOM() LIMIT 20').all();

      const questions = [];
      const usedIndexes = new Set();

      // Pick 5 distinct questions
      for (let i = 0; i < Math.min(5, allWords.length); i++) {
        const target = allWords[i];
        const questionType = i % 2 === 0 ? 'eng_to_regional' : 'regional_to_eng';

        // Select 3 distractors
        const otherWords = allWords.filter(w => w.word_id !== target.word_id);
        const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
        const optionsList = [target, ...distractors].sort(() => 0.5 - Math.random());

        let regionalText = target.telugu_meaning;
        if (language === 'hi') regionalText = target.hindi_meaning;
        if (language === 'ta') regionalText = target.tamil_meaning;

        if (questionType === 'eng_to_regional') {
          questions.push({
            id: i + 1,
            targetWord: target.english_word,
            phonetic: target.phonetic_guide,
            questionText: `What is the regional meaning of "${target.english_word}"?`,
            questionSub: `Pronounced: ${target.phonetic_guide}`,
            options: optionsList.map(opt => {
              let text = opt.telugu_meaning;
              if (language === 'hi') text = opt.hindi_meaning;
              if (language === 'ta') text = opt.tamil_meaning;
              // Clean up to first 60 chars
              return text.split('(')[0].trim();
            }),
            correctAnswer: regionalText.split('(')[0].trim(),
            explanation: target.definition,
            example: target.example_sentence
          });
        } else {
          questions.push({
            id: i + 1,
            targetWord: target.english_word,
            phonetic: target.phonetic_guide,
            questionText: `Which English engineering term matches this description?`,
            questionSub: regionalText.split('(')[0].trim(),
            options: optionsList.map(opt => opt.english_word),
            correctAnswer: target.english_word,
            explanation: `${target.english_word} (${target.phonetic_guide}): ${target.definition}`,
            example: target.example_sentence
          });
        }
      }

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: questions.length, data: questions }));
      return;
    }

    // Default 404 for unknown API
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: 'API route not found' }));
  } catch (error) {
    console.error('[API Error]', error);
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
}

module.exports = { handleApiRequest };
