let currentQuestionIndex = 0;
let questions = [];
let selectedWords = []; // 解答欄にある単語のIDリスト
let availableWords = []; // 問題データの元のwords配列

// DOM Elements
const japaneseTextEl = document.getElementById('japanese-text');
const answerAreaEl = document.getElementById('answer-area');
const wordBankEl = document.getElementById('word-bank');
const checkBtn = document.getElementById('check-btn');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackExplanation = document.getElementById('feedback-explanation');
const nextBtn = document.getElementById('next-btn');
const currentIndexEl = document.getElementById('current-question-index');
const totalQuestionsEl = document.getElementById('total-questions');

// Initialize
async function init() {
  try {
    const response = await fetch('./questions.json');
    questions = await response.json();
    totalQuestionsEl.textContent = questions.length;
    loadQuestion();
  } catch (e) {
    console.error("Failed to load questions:", e);
    japaneseTextEl.textContent = "問題データの読み込みに失敗しました。";
  }
}

function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    alert("全問題クリア！お疲れ様でした。");
    currentQuestionIndex = 0; // 最初から
  }
  
  const q = questions[currentQuestionIndex];
  currentIndexEl.textContent = currentQuestionIndex + 1;
  japaneseTextEl.textContent = q.japanese;
  
  // 選択状態のリセット
  selectedWords = [];
  
  // 単語をシャッフル
  availableWords = [...q.words].sort(() => Math.random() - 0.5);
  
  renderWords();
  
  // UIリセット
  feedbackModal.classList.add('hidden');
  feedbackModal.classList.remove('correct', 'incorrect');
  checkBtn.disabled = true;
  checkBtn.textContent = "答え合わせ";
}

function renderWords() {
  // Answer Area の描画
  answerAreaEl.innerHTML = '';
  selectedWords.forEach(wordId => {
    const word = availableWords.find(w => w.id === wordId);
    if(word) {
      answerAreaEl.appendChild(createWordBlock(word, true));
    }
  });

  // Word Bank の描画
  wordBankEl.innerHTML = '';
  availableWords.forEach(word => {
    if (selectedWords.includes(word.id)) {
      // 選択済みの場合はプレースホルダーを表示
      const block = createWordBlock(word, false);
      block.classList.add('placeholder');
      wordBankEl.appendChild(block);
    } else {
      wordBankEl.appendChild(createWordBlock(word, false));
    }
  });

  // 答え合わせボタンの有効化（すべて選択された場合のみ）
  checkBtn.disabled = selectedWords.length !== availableWords.length;
}

function createWordBlock(word, inAnswerArea) {
  const div = document.createElement('div');
  div.className = 'word-block';
  div.dataset.id = word.id;
  
  const pinyin = document.createElement('div');
  pinyin.className = 'pinyin';
  pinyin.textContent = word.pinyin;
  
  const hanzi = document.createElement('div');
  hanzi.className = 'hanzi';
  hanzi.textContent = word.text;
  
  div.appendChild(pinyin);
  div.appendChild(hanzi);
  
  div.addEventListener('click', () => {
    if (inAnswerArea) {
      // 解答欄から消す
      selectedWords = selectedWords.filter(id => id !== word.id);
    } else {
      // 解答欄に追加
      if (!selectedWords.includes(word.id)) {
        selectedWords.push(word.id);
      }
    }
    renderWords();
  });
  
  return div;
}

function checkAnswer() {
  const q = questions[currentQuestionIndex];
  const isCorrect = selectedWords.join(',') === q.correctOrder.join(',');
  
  feedbackModal.classList.remove('hidden', 'correct', 'incorrect');
  
  if (isCorrect) {
    feedbackModal.classList.add('correct');
    feedbackTitle.textContent = "正解！";
  } else {
    feedbackModal.classList.add('incorrect');
    feedbackTitle.textContent = "不正解...";
  }
  
  feedbackExplanation.textContent = q.explanation;
}

// Event Listeners
checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  loadQuestion();
});

// Start
init();
