const db = require('../models/database');

function getUserProgress(userId = 1) {
  // 1. Fetch user profile
  let user = db.prepare('SELECT * FROM UserProfiles WHERE user_id = ?').get(userId);
  if (!user) {
    user = { user_id: 1, name: 'Student Learner', language: 'te', daily_goal: 5, streak: 3 };
  }

  // 2. Fetch today's progress log
  const today = new Date().toISOString().split('T')[0];
  let todayLog = db.prepare(`
    SELECT * FROM ProgressLogs 
    WHERE user_id = ? AND learning_date = ?
  `).get(userId, today);

  if (!todayLog) {
    // Insert new row for today
    db.prepare(`
      INSERT INTO ProgressLogs (user_id, completed_words, daily_goal, learning_date, streak)
      VALUES (?, 0, ?, ?, ?)
    `).run(userId, user.daily_goal || 5, today, user.streak || 1);

    todayLog = {
      user_id: userId,
      completed_words: 0,
      daily_goal: user.daily_goal || 5,
      learning_date: today,
      streak: user.streak || 1
    };
  }

  // 3. Overall stats: total attempts, average match score
  const scoreStats = db.prepare(`
    SELECT 
      COUNT(*) as total_attempts,
      AVG(match_score) as avg_score,
      MAX(match_score) as top_score
    FROM PronunciationScores 
    WHERE user_id = ?
  `).get(userId);

  // 4. Recent practice history (last 10 attempts)
  const recentAttempts = db.prepare(`
    SELECT 
      score_id, word_id, target_word, recognized_text, match_score, feedback, attempt_date
    FROM PronunciationScores 
    WHERE user_id = ? 
    ORDER BY attempt_date DESC 
    LIMIT 10
  `).all(userId);

  // 5. Total vocabulary count in system
  const totalVocab = db.prepare('SELECT COUNT(*) as count FROM VocabularyUnits').get().count;

  return {
    user: {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      language: user.language,
      dailyGoal: user.daily_goal,
      streak: user.streak
    },
    today: {
      completedWords: todayLog.completed_words,
      dailyGoal: todayLog.daily_goal,
      percentage: Math.min(100, Math.round((todayLog.completed_words / (todayLog.daily_goal || 1)) * 100)),
      isGoalMet: todayLog.completed_words >= todayLog.daily_goal
    },
    stats: {
      totalAttempts: scoreStats.total_attempts || 0,
      averageScore: scoreStats.avg_score ? Math.round(scoreStats.avg_score) : 0,
      topScore: scoreStats.top_score || 0,
      totalVocabInDeck: totalVocab,
      masteredWords: Math.min(totalVocab, todayLog.completed_words + (user.streak * 2))
    },
    recentAttempts
  };
}

function incrementCompletedWord(userId = 1) {
  const today = new Date().toISOString().split('T')[0];
  
  // Update or insert today's progress
  let log = db.prepare('SELECT * FROM ProgressLogs WHERE user_id = ? AND learning_date = ?').get(userId, today);
  if (!log) {
    db.prepare(`
      INSERT INTO ProgressLogs (user_id, completed_words, daily_goal, learning_date, streak)
      VALUES (?, 1, 5, ?, 1)
    `).run(userId, today);
  } else {
    db.prepare(`
      UPDATE ProgressLogs 
      SET completed_words = completed_words + 1 
      WHERE user_id = ? AND learning_date = ?
    `).run(userId, today);
  }

  // Check if daily goal achieved, increment streak if not already incremented today
  log = db.prepare('SELECT * FROM ProgressLogs WHERE user_id = ? AND learning_date = ?').get(userId, today);
  if (log.completed_words === log.daily_goal) {
    db.prepare('UPDATE UserProfiles SET streak = streak + 1 WHERE user_id = ?').run(userId);
  }

  return getUserProgress(userId);
}

function updateLanguage(userId = 1, language = 'te') {
  db.prepare('UPDATE UserProfiles SET language = ? WHERE user_id = ?').run(language, userId);
  return { success: true, language };
}

module.exports = {
  getUserProgress,
  incrementCompletedWord,
  updateLanguage
};
