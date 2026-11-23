/**
 * Levenshtein distance string similarity algorithm
 * Formula: Score = (1 - D / L) * 100
 */
function computeLevenshtein(a, b) {
  const s1 = (a || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const s2 = (b || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  if (s1 === s2) return { distance: 0, score: 100 };
  if (!s1.length) return { distance: s2.length, score: 0 };
  if (!s2.length) return { distance: s1.length, score: 0 };

  const matrix = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  let score = Math.max(0, Math.min(100, Math.round((1 - distance / maxLen) * 100)));

  // Accent tolerance bonus as specified in FSD
  let accentTolerance = false;
  if (distance <= 2 && score >= 70 && score < 95) {
    score = Math.min(100, score + 10);
    accentTolerance = true;
  }

  return { distance, score, accentTolerance, s1, s2 };
}

window.computeLevenshtein = computeLevenshtein;
