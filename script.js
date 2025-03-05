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
    const statsDiv = document.getElementById('stats');
    const totalCount = document.getElementById('total-count');
    const successCount = document.getElementById('success-count');
    const errorCount = document.getElementById('error-count');
    const successRate = document.getElementById('success-rate');
    const errorHistory = document.getElementById('error-history');
    const errorList = document.getElementById('error-list');

    // Initialiser la liste des erreurs comme cachée
    errorList.style.display = 'none';

    function updateErrorTitle() {
        const errorCount = errorHistoryList.length;
        const baseText = errorList.style.display === 'none' ? 'Voir mes erreurs' : 'Masquer mes erreurs';
        errorTitle.innerHTML = `${baseText} (${errorCount}) <span class="arrow">▼</span>`;
        errorTitle.classList.toggle('open', errorList.style.display !== 'none');
    }

    // Ajouter le gestionnaire de clic sur le titre
    const errorTitle = errorHistory.querySelector('h2');
    errorTitle.addEventListener('click', () => {
        errorList.style.display = errorList.style.display === 'none' ? 'block' : 'none';
        updateErrorTitle();
    });

    let selectedTables = [];
    let currentQuestion = {};
    let lastQuestion = null;
    let stats = {
        total: 0,
        success: 0,
        errors: 0
    };
    let errorHistoryList = [];

    // Sélection des tables
    tableButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ignorer le bouton spécial
            if (btn === selectAllBtn) return;

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
            // Ignorer le bouton spécial lui-même
            if (btn === selectAllBtn) return;

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
        statsDiv.style.display = 'block';
        errorHistory.style.display = 'block';
        result.style.display = 'none';
        stats = { total: 0, success: 0, errors: 0 };
        errorHistoryList = [];
        updateErrorHistory();
        updateStats();
        nextQuestion();
    });

    function updateStats() {
        totalCount.textContent = stats.total;
        successCount.textContent = stats.success;
        errorCount.textContent = stats.errors;
        const rate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
        successRate.textContent = rate;
    }

    function updateErrorHistory() {
        errorList.innerHTML = '';
        errorHistoryList.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-item';
            errorElement.innerHTML = `
              <span class="error-question">${error.question}</span>
              <span class="error-user-answer">Ta réponse : ${error.userAnswer}</span>
              <span class="error-correct-answer">Bonne réponse : ${error.correctAnswer}</span>
          `;
            errorList.appendChild(errorElement);
        });
        updateErrorTitle();
    }

    // Gestion du pavé numérique
    numButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const [equation, currentValue] = questionDiv.textContent.split('=');
            const newValue = currentValue.trim() === '?' ? btn.textContent : (currentValue.trim() + btn.textContent);
            questionDiv.textContent = `${equation}= ${newValue}`;
        });
    });

    // Effacement de la réponse
    clearBtn.addEventListener('click', () => {
        const equation = questionDiv.textContent.split('=')[0];
        questionDiv.textContent = `${equation}= ?`;
    });

    // Validation de la réponse
    validateBtn.addEventListener('click', () => {
        const userAnswer = parseInt(questionDiv.textContent.split('=')[1]);
        result.style.display = 'block';
        stats.total++;

        if (userAnswer === currentQuestion.answer) {
            stats.success++;
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
            stats.errors++;
            emoji.textContent = '😢';
            resultText.innerHTML = `La bonne réponse était ${currentQuestion.num1} x ${currentQuestion.num2} = <span class="correct-answer">${currentQuestion.answer}</span>`;

            // Ajouter l'erreur à l'historique
            errorHistoryList.push({
                question: `${currentQuestion.num1} x ${currentQuestion.num2}`,
                userAnswer: userAnswer,
                correctAnswer: currentQuestion.answer
            });
            updateErrorHistory();

            animateProgress(3000);
            setTimeout(nextQuestion, 3000);
        }
        updateStats();
    });

    // Passage à la question suivante
    function nextQuestion() {
        currentQuestion = generateQuestion();
        if (currentQuestion) {
            questionDiv.textContent = `${currentQuestion.num1} x ${currentQuestion.num2} = ?`;
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