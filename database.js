const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const { vocabularyData } = require('./seedData');

const dbPath = path.join(__dirname, '..', '..', 'database', 'bhashabuddy.db');

// Ensure database folder exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Initialize tables based on FSD specification
function initDB() {
  // Table 1: UserProfiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS UserProfiles (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      language TEXT DEFAULT 'te',
      daily_goal INTEGER DEFAULT 5,
      streak INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table 2: VocabularyUnits
  db.exec(`
    CREATE TABLE IF NOT EXISTS VocabularyUnits (
      word_id INTEGER PRIMARY KEY AUTOINCREMENT,
      english_word TEXT UNIQUE NOT NULL,
      phonetic_guide TEXT,
      telugu_meaning TEXT,
      hindi_meaning TEXT,
      tamil_meaning TEXT,
      definition TEXT,
      example_sentence TEXT,
      category TEXT,
      difficulty TEXT,
      icon_type TEXT
    );
  `);

  // Table 3: ProgressLogs
  db.exec(`
    CREATE TABLE IF NOT EXISTS ProgressLogs (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT 1,
      completed_words INTEGER DEFAULT 0,
      daily_goal INTEGER DEFAULT 5,
      learning_date DATE DEFAULT (DATE('now')),
      streak INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES UserProfiles(user_id)
    );
  `);

  // Table 4: PronunciationScores
  db.exec(`
    CREATE TABLE IF NOT EXISTS PronunciationScores (
      score_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT 1,
      word_id INTEGER,
      target_word TEXT,
      recognized_text TEXT,
      match_score REAL,
      feedback TEXT,
      attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES UserProfiles(user_id),
      FOREIGN KEY (word_id) REFERENCES VocabularyUnits(word_id)
    );
  `);

  // Seed default guest user if table is empty
  const checkUser = db.prepare('SELECT COUNT(*) as count FROM UserProfiles').get();
  if (checkUser.count === 0) {
    db.prepare(`
      INSERT INTO UserProfiles (name, email, password_hash, language, daily_goal, streak)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Student Learner', 'student@bhashabuddy.edu', 'demo_hash', 'te', 5, 3);
  }

  // Seed vocabulary if table is empty
  const checkWords = db.prepare('SELECT COUNT(*) as count FROM VocabularyUnits').get();
  if (checkWords.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO VocabularyUnits (
        english_word, phonetic_guide, telugu_meaning, hindi_meaning,
        tamil_meaning, definition, example_sentence, category, difficulty, icon_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of vocabularyData) {
      insertStmt.run(
        item.english_word,
        item.phonetic_guide,
        item.telugu_meaning,
        item.hindi_meaning,
        item.tamil_meaning,
        item.definition,
        item.example_sentence,
        item.category,
        item.difficulty,
        item.icon_type
      );
    }
    console.log(`[Database] Successfully seeded ${vocabularyData.length} technical vocabulary words into SQLite!`);
  }
}

initDB();

module.exports = db;
