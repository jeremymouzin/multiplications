document.addEventListener('DOMContentLoaded', () => {
  const tableButtons = document.querySelectorAll('.table-btn');
  const startBtn = document.getElementById('start-btn');
  const gameArea = document.getElementById('game-area');
  const numButtons = document.querySelectorAll('.num-btn');
  const clearBtn = document.getElementById('clear-btn');
  const validateBtn = document.getElementById('validate-btn');
  const questionDiv = document.getElementById('question');
  const currentAnswer = document.getElementById('current-answer');
  const result = document.getElementById('result');
  const resultText = document.getElementById('result-text');
  const emoji = document.getElementById('emoji');
  const selectAllBtn = document.getElementById('select-all-btn');
  const progressBar = document.getElementById('progress-bar');

  let selectedTables = [];
  let currentQuestion = {};
  let lastQuestion = null;
  
  // Sélection des tables
  tableButtons.forEach(btn => {
      btn.addEventListener('click', () => {
          btn.classList.toggle('selected');
          const number = parseInt(btn.dataset.number);
          if (selectedTables.includes(number)) {
              selectedTables = selectedTables.filter(n => n !== number);
          } else {
              selectedTables.push(number);
          }
      });
  });

  // Sélectionner/Désélectionner toutes les tables
  selectAllBtn.addEventListener('click', () => {
      const isSelecting = selectAllBtn.textContent === "Toutes";
      selectedTables = [];
      tableButtons.forEach(btn => {
          if (isSelecting) {
              btn.classList.add('selected');
              const number = parseInt(btn.dataset.number);
              selectedTables.push(number);
          } else {
              btn.classList.remove('selected');
          }
      });
      selectAllBtn.textContent = isSelecting ? "Aucune" : "Toutes";
      if (isSelecting) {
          selectAllBtn.classList.add('selected');
      } else {
          selectAllBtn.classList.remove('selected');
      }
  });

  // Génération d'une question aléatoire
  function generateQuestion() {
      if (selectedTables.length === 0) return null;
      let newQuestion;
      do {
          const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
          const multiplier = Math.floor(Math.random() * 10) + 1;
          newQuestion = {
              num1: multiplier,
              num2: table,
              answer: multiplier * table
          };
      } while (lastQuestion && 
              lastQuestion.num1 === newQuestion.num1 && 
              lastQuestion.num2 === newQuestion.num2);
      
      lastQuestion = newQuestion;
      return newQuestion;
  }

  // Démarrage du jeu
  startBtn.addEventListener('click', () => {
      if (selectedTables.length === 0) {
          alert('Veuillez sélectionner au moins une table de multiplication !');
          return;
      }
      gameArea.style.display = 'block';
      result.style.display = 'none';
      nextQuestion();
  });

  // Gestion du pavé numérique
  numButtons.forEach(btn => {
      btn.addEventListener('click', () => {
          if (currentAnswer.textContent === '0') {
              currentAnswer.textContent = btn.textContent;
          } else {
              currentAnswer.textContent += btn.textContent;
          }
      });
  });

  // Effacement de la réponse
  clearBtn.addEventListener('click', () => {
      currentAnswer.textContent = '0';
  });

  // Validation de la réponse
  validateBtn.addEventListener('click', () => {
      const userAnswer = parseInt(currentAnswer.textContent);
      result.style.display = 'block';
      
      if (userAnswer === currentQuestion.answer) {
          confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
          });
          emoji.textContent = '🎉';
          resultText.textContent = '';
          animateProgress(1500);
          setTimeout(nextQuestion, 1500);
      } else {
          emoji.textContent = '😢';
          resultText.innerHTML = `La bonne réponse était ${currentQuestion.num1} x ${currentQuestion.num2} = <span class="correct-answer">${currentQuestion.answer}</span>`;
          animateProgress(3000);
          setTimeout(nextQuestion, 3000);
      }
  });

  // Passage à la question suivante
  function nextQuestion() {
      currentQuestion = generateQuestion();
      if (currentQuestion) {
          questionDiv.textContent = `${currentQuestion.num1} x ${currentQuestion.num2} = ?`;
          currentAnswer.textContent = '0';
          result.style.display = 'none';
      }
  }

  function animateProgress(duration) {
      progressBar.style.transition = `width ${duration}ms linear`;
      progressBar.style.width = '100%';
      setTimeout(() => {
          progressBar.style.width = '0';
      }, 100);
  }
});