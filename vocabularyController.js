const db = require('../models/database');

function getAllVocabulary(options = {}) {
  const { category, difficulty, search } = options;
  let query = 'SELECT * FROM VocabularyUnits WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (difficulty && difficulty !== 'All') {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  if (search && search.trim() !== '') {
    query += ' AND (english_word LIKE ? OR telugu_meaning LIKE ? OR hindi_meaning LIKE ? OR tamil_meaning LIKE ?)';
    const s = `%${search.trim()}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY word_id ASC';

  return db.prepare(query).all(...params);
}

function getVocabularyById(id) {
  return db.prepare('SELECT * FROM VocabularyUnits WHERE word_id = ?').get(id);
}

function getCategories() {
  return db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM VocabularyUnits 
    GROUP BY category
    ORDER BY category ASC
  `).all();
}

function getDailyDeck(limit = 5) {
  // Returns 5 balanced words for today's daily goal practice
  return db.prepare(`
    SELECT * FROM VocabularyUnits 
    ORDER BY RANDOM() 
    LIMIT ?
  `).all(limit);
}

module.exports = {
  getAllVocabulary,
  getVocabularyById,
  getCategories,
  getDailyDeck
};
