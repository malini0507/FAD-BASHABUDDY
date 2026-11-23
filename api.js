/**
 * API Client for BhashaBuddy Backend
 */

const API = {
  async getVocabulary(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/vocabulary?${qs}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch('/api/vocabulary/categories');
    return res.json();
  },

  async getDailyDeck() {
    const res = await fetch('/api/vocabulary/daily');
    return res.json();
  },

  async evaluatePronunciation(targetWord, spokenText, wordId = null) {
    const res = await fetch('/api/pronunciation/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetWord, spokenText, wordId, userId: 1 })
    });
    return res.json();
  },

  async getProgress() {
    const res = await fetch('/api/progress');
    return res.json();
  },

  async markWordCompleted() {
    const res = await fetch('/api/progress/complete-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async sendChatMessage(message, language = 'te') {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language })
    });
    return res.json();
  },

  async getQuiz(lang = 'te') {
    const res = await fetch(`/api/quiz?lang=${lang}`);
    return res.json();
  }
};

window.API = API;
