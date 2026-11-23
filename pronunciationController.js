const db = require('../models/database');

/**
 * Computes Levenshtein Distance between two strings.
 * Number of insertions, deletions, or substitutions required to transform a into b.
 */
function levenshteinDistance(a, b) {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return track[s2.length][s1.length];
}

/**
 * Evaluates pronunciation based on Levenshtein distance,
 * returning score (0-100), accent tolerance, feedback, and phoneme hints.
 */
function evaluatePronunciation(targetWord, spokenText, userId = 1, wordId = null) {
  if (!targetWord || !spokenText) {
    return {
      matchScore: 0,
      feedback: "No speech recognized. Please speak clearly into the microphone.",
      status: "fail"
    };
  }

  const cleanTarget = targetWord.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanSpoken = spokenText.toLowerCase().replace(/[^a-z0-9]/g, '');

  const distance = levenshteinDistance(cleanTarget, cleanSpoken);
  const maxLen = Math.max(cleanTarget.length, cleanSpoken.length);

  // Score formula from FSD: (1 - D / L) * 100
  let rawScore = maxLen > 0 ? (1 - distance / maxLen) * 100 : 0;
  rawScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Vernacular accent relaxation bonus:
  // FSD Note: "Heavy regional accents causing false negative speech recognition rejections.
  // Tip: Use fuzzy string matching (Levenshtein distance <= 2) or phoneme approximation"
  let effectiveScore = rawScore;
  let accentToleranceApplied = false;

  if (distance <= 2 && rawScore >= 70 && rawScore < 95) {
    effectiveScore = Math.min(100, rawScore + 10);
    accentToleranceApplied = true;
  }

  let feedback = "";
  let badge = "practice";

  if (effectiveScore >= 90) {
    feedback = "Excellent pronunciation! Your English syllable stress and articulation are spot on.";
    badge = "excellent";
  } else if (effectiveScore >= 75) {
    feedback = "Very good attempt! Minor regional accent detected, perfectly understandable in interviews.";
    badge = "good";
  } else if (effectiveScore >= 50) {
    feedback = "Good practice! Listen to the native TTS audio once more, focus on the phonetic breakdown.";
    badge = "fair";
  } else {
    feedback = "Keep trying! Break the word down into syllables and practice with the slow 0.8x audio playback.";
    badge = "needs_practice";
  }

  // Save score to SQLite database
  try {
    const insertStmt = db.prepare(`
      INSERT INTO PronunciationScores (user_id, word_id, target_word, recognized_text, match_score, feedback)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(userId, wordId, targetWord, spokenText, effectiveScore, feedback);
  } catch (err) {
    console.error("[Pronunciation] Error saving score to DB:", err.message);
  }

  return {
    targetWord,
    spokenText,
    distance,
    matchScore: effectiveScore,
    rawScore,
    accentToleranceApplied,
    feedback,
    badge
  };
}

module.exports = {
  levenshteinDistance,
  evaluatePronunciation
};
