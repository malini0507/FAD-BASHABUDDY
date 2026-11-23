/**
 * BhashaBuddy Main Application Orchestrator
 */

window.appState = {
  currentTab: 'dashboard',
  vocabularyList: [],
  dailyWords: [],
  progress: null,
  categories: [],
  selectedCategory: 'All',
  selectedDifficulty: 'All',
  searchQuery: ''
};

async function initApp() {
  try {
    // 1. Subscribe to language context changes
    window.LangManager.subscribe(() => {
      window.renderApp();
    });

    // 2. Fetch initial data from SQLite REST endpoints
    const [vocabRes, dailyRes, progRes, catRes] = await Promise.all([
      window.API.getVocabulary(),
      window.API.getDailyDeck(),
      window.API.getProgress(),
      window.API.getCategories()
    ]);

    if (vocabRes.success) window.appState.vocabularyList = vocabRes.data;
    if (dailyRes.success) window.appState.dailyWords = dailyRes.data;
    if (progRes.success) window.appState.progress = progRes.data;
    if (catRes.success) window.appState.categories = catRes.data;

    // 3. Register Service Worker for offline capability (FSD requirement)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration note:', err.message);
      });
    }

    // 4. Initial Render
    window.renderApp();
  } catch (err) {
    console.error('Initialization error:', err);
    window.renderApp();
  }
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const currentTab = window.appState.currentTab;

  let mainContent = '';
  switch (currentTab) {
    case 'dashboard':
      mainContent = window.renderDashboard(window.appState);
      break;
    case 'flashcards':
      mainContent = window.renderFlashcards(window.appState);
      break;
    case 'pronunciation':
      mainContent = window.renderPronunciationLab(window.appState);
      break;
    case 'vocabulary':
      mainContent = window.renderVocabulary(window.appState);
      break;
    case 'quiz':
      mainContent = window.renderQuiz(window.appState);
      break;
    case 'visualDict':
      mainContent = window.renderVisualDictionary(window.appState);
      break;
    case 'analytics':
      mainContent = window.renderProgressTracker(window.appState);
      break;
    case 'chatbot':
      mainContent = window.renderChatbot(window.appState);
      break;
    default:
      mainContent = window.renderDashboard(window.appState);
  }

  root.innerHTML = `
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      ${window.renderNavbar(currentTab, window.appState.progress)}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        ${mainContent}
      </main>
      
      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 BhashaBuddy • VoiceBridge Jam Hackathon Initiative</p>
          <div class="flex items-center gap-4 text-indigo-600 font-medium">
            <span>Levenshtein Distance Phonetic Evaluator</span>
            <span>•</span>
            <span>SQLite Powered</span>
            <span>•</span>
            <span>Bilingual EdTech</span>
          </div>
        </div>
      </footer>
    </div>
  `;
}

window.renderApp = renderApp;

window.switchTab = (tab) => {
  window.appState.currentTab = tab;
  window.renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.handleLanguageChange = (lang) => {
  window.LangManager.setLang(lang);
};

window.filterByCategory = (cat) => {
  window.appState.selectedCategory = cat;
  window.switchTab('vocabulary');
};

window.filterDeckCategory = (cat) => {
  window.appState.selectedCategory = cat;
  window.API.getVocabulary({ category: cat }).then(res => {
    if (res.success) {
      window.appState.vocabularyList = res.data;
      window.renderApp();
    }
  });
};

window.markLearned = async (wordId) => {
  try {
    const res = await window.API.markWordCompleted();
    if (res.success) {
      window.appState.progress = res.data;
      if (window.triggerCelebration) window.triggerCelebration();
      alert('🎉 Great job! Progress logged to your daily goal and SQLite database.');
      window.renderApp();
    }
  } catch (err) {
    console.error(err);
  }
};

window.fetchProgress = async () => {
  const res = await window.API.getProgress();
  if (res.success) {
    window.appState.progress = res.data;
    window.renderApp();
  }
};

// Canvas Confetti Celebration Utility
window.triggerCelebration = () => {
  const canvas = document.getElementById('celebrationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      r: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
      alpha: 1
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.alpha -= 0.015;
      if (p.alpha > 0) {
        alive = true;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  frame();
};

// Keyboard navigation (Spacebar flips card, Arrows navigate)
window.addEventListener('keydown', (e) => {
  if (window.appState.currentTab === 'flashcards') {
    if (e.code === 'Space') {
      e.preventDefault();
      if (window.toggleFlipCard) window.toggleFlipCard();
    } else if (e.code === 'ArrowRight') {
      if (window.nextCard) window.nextCard();
    } else if (e.code === 'ArrowLeft') {
      if (window.prevCard) window.prevCard();
    }
  }
});

// Start on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
