// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    categoryScreen: document.getElementById('category-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    reviewScreen: document.getElementById('review-screen'),
    questionNumber: document.getElementById('question-number'),
    categoryName: document.getElementById('category-name'),
    timerDisplay: document.getElementById('time'),
    progressBar: document.getElementById('progress-bar'),
    questionText: document.getElementById('question'),
    optionsContainer: document.getElementById('options'),
    nextButton: document.getElementById('next-btn'),
    hintButton: document.getElementById('hint-btn'),
    scorePercent: document.getElementById('score-percent'),
    scoreMessage: document.getElementById('score-message'),
    correctAnswers: document.getElementById('correct-answers'),
    wrongAnswers: document.getElementById('wrong-answers'),
    timeTaken: document.getElementById('time-taken'),
    reviewButton: document.getElementById('review-btn'),
    restartButton: document.getElementById('restart-btn'),
    backToResults: document.getElementById('back-to-results'),
    reviewQuestions: document.getElementById('review-questions'),
    hintModal: document.getElementById('hint-modal'),
    hintText: document.getElementById('hint-text'),
    closeModal: document.querySelector('.close-modal'),
    correctSound: document.getElementById('correct-sound'),
    wrongSound: document.getElementById('wrong-sound'),
    timerSound: document.getElementById('timer-sound'),
    themeToggle: document.getElementById('theme-toggle'),
    soundToggle: document.getElementById('sound-toggle')
};

// Quiz State
const state = {
    currentCategory: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [],
    timer: null,
    timeLeft: 30,
    startTime: 0,
    endTime: 0,
    darkMode: localStorage.getItem('darkMode') === 'true',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false'
};

// Fetch questions from local JSON file
async function fetchQuestions(category, amount = 10) {
    try {
        const response = await fetch('./data/questions.json'); // Adjust to './data/questions.json' if stored in a subfolder
        const data = await response.json();
        
        if (!data[category] || !Array.isArray(data[category]) || data[category].length === 0) {
            throw new Error(`No questions found for category: ${category}`);
        }
        
        // Shuffle questions and take the first `amount`
        const shuffledQuestions = [...data[category]];
        shuffleArray(shuffledQuestions);
        return shuffledQuestions.slice(0, amount);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

// Initialize the app
function init() {
    setTheme(state.darkMode);
    setSound(state.soundEnabled);
    setupEventListeners();
    elements.loadingScreen.classList.remove('active');
    elements.categoryScreen.classList.add('active');
}

function setupEventListeners() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            selectCategory(category);
        });
    });
    
    elements.nextButton.addEventListener('click', nextQuestion);
    elements.hintButton.addEventListener('click', showHint);
    elements.closeModal.addEventListener('click', closeModal);
    elements.hintModal.addEventListener('click', (e) => {
        if (e.target === elements.hintModal) closeModal();
    });
    elements.reviewButton.addEventListener('click', showReview);
    elements.restartButton.addEventListener('click', restartQuiz);
    elements.backToResults.addEventListener('click', () => {
        elements.reviewScreen.classList.remove('active');
        elements.resultsScreen.classList.add('active');
    });
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.soundToggle.addEventListener('click', toggleSound);
}

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    elements.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDark);
}

function setSound(isEnabled) {
    elements.soundToggle.innerHTML = isEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    localStorage.setItem('soundEnabled', isEnabled);
}

function toggleTheme() {
    state.darkMode = !state.darkMode;
    setTheme(state.darkMode);
}

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    setSound(state.soundEnabled);
}

function selectCategory(category) {
    state.currentCategory = category;
    
    elements.categoryScreen.classList.remove('active');
    elements.loadingScreen.classList.add('active');
    
    fetchQuestions(category, 10).then(questions => {
        if (questions.length === 0) {
            alert('Failed to load questions. Please try again later.');
            elements.loadingScreen.classList.remove('active');
            elements.categoryScreen.classList.add('active');
            return;
        }
        
        state.questions = questions;
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.userAnswers = new Array(state.questions.length).fill(null);
        state.timeLeft = 30;
        
        elements.loadingScreen.classList.remove('active');
        elements.quizScreen.classList.add('active');
        startQuiz();
    });
}

function startQuiz() {
    state.startTime = Date.now();
    showQuestion();
    startTimer();
}

function showQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    
    const progress = (state.currentQuestionIndex / state.questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.questionNumber.textContent = `Q${state.currentQuestionIndex + 1}/${state.questions.length}`;
    elements.categoryName.textContent = state.currentCategory.charAt(0).toUpperCase() + state.currentCategory.slice(1);
    
    elements.questionText.textContent = question.question;
    elements.optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.answer = index;
        
        if (state.userAnswers[state.currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', selectAnswer);
        elements.optionsContainer.appendChild(optionElement);
    });
    
    resetTimer();
    elements.nextButton.disabled = state.userAnswers[state.currentQuestionIndex] === null;
    elements.nextButton.classList.toggle('disabled', state.userAnswers[state.currentQuestionIndex] === null);
}

function selectAnswer(e) {
    const selectedOption = e.target;
    const selectedAnswer = parseInt(selectedOption.dataset.answer);
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedOption.classList.add('selected');
    
    state.userAnswers[state.currentQuestionIndex] = selectedAnswer;
    elements.nextButton.disabled = false;
    elements.nextButton.classList.remove('disabled');
}

function nextQuestion() {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const userAnswer = state.userAnswers[state.currentQuestionIndex];
    
    if (userAnswer === currentQuestion.answer) {
        state.score += 1;
        if (state.soundEnabled) {
            elements.correctSound.currentTime = 0;
            elements.correctSound.play();
        }
    } else {
        if (state.soundEnabled) {
            elements.wrongSound.currentTime = 0;
            elements.wrongSound.play();
        }
    }
    
    if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function startTimer() {
    clearInterval(state.timer);
    state.timeLeft = 30;
    updateTimerDisplay();
    
    state.timer = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay();
        
        if (state.timeLeft <= 5 && state.soundEnabled) {
            elements.timerSound.currentTime = 0;
            elements.timerSound.play();
        }
        
        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            handleTimeOut();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(state.timer);
    state.timeLeft = 30;
    updateTimerDisplay();
    startTimer();
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = state.timeLeft;
    if (state.timeLeft <= 10) {
        elements.timerDisplay.style.color = 'var(--danger-color)';
    } else {
        elements.timerDisplay.style.color = 'inherit';
    }
}

function handleTimeOut() {
    if (state.userAnswers[state.currentQuestionIndex] === null) {
        state.userAnswers[state.currentQuestionIndex] = -1;
    }
    
    if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    clearInterval(state.timer);
    state.endTime = Date.now();
    
    calculateResults();
    elements.quizScreen.classList.remove('active');
    elements.resultsScreen.classList.add('active');
    
    if (state.score >= state.questions.length * 0.8) {
        startConfetti();
        setTimeout(stopConfetti, 3000);
    }
}

function calculateResults() {
    const totalQuestions = state.questions.length;
    const percentage = Math.round((state.score / totalQuestions) * 100);
    const timeSpent = Math.floor((state.endTime - state.startTime) / 1000);
    
    elements.scorePercent.textContent = `${percentage}%`;
    elements.correctAnswers.textContent = state.score;
    elements.wrongAnswers.textContent = totalQuestions - state.score;
    elements.timeTaken.textContent = `${timeSpent}s`;
    
    if (percentage >= 90) {
        elements.scoreMessage.textContent = "Excellent!";
    } else if (percentage >= 70) {
        elements.scoreMessage.textContent = "Great Job!";
    } else if (percentage >= 50) {
        elements.scoreMessage.textContent = "Good Effort!";
    } else {
        elements.scoreMessage.textContent = "Keep Practicing!";
    }
    
    const circle = document.querySelector('.score-circle-fill');
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    circle.style.stroke = getScoreColor(percentage);
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
}

function getScoreColor(percentage) {
    if (percentage >= 90) return 'var(--success-color)';
    if (percentage >= 70) return 'var(--primary-color)';
    if (percentage >= 50) return 'var(--warning-color)';
    return 'var(--danger-color)';
}

function showHint() {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    elements.hintText.textContent = currentQuestion.hint || 'No hint available for this question.';
    elements.hintModal.classList.add('active');
}

function closeModal() {
    elements.hintModal.classList.remove('active');
}

function showReview() {
    elements.resultsScreen.classList.remove('active');
    elements.reviewScreen.classList.add('active');
    
    elements.reviewQuestions.innerHTML = '';
    
    state.questions.forEach((question, index) => {
        const userAnswer = state.userAnswers[index];
        const isCorrect = userAnswer === question.answer;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const questionElement = document.createElement('div');
        questionElement.className = 'review-question';
        questionElement.textContent = `${index + 1}. ${question.question}`;
        reviewItem.appendChild(questionElement);
        
        const correctAnswer = document.createElement('div');
        correctAnswer.className = 'review-answer correct';
        correctAnswer.innerHTML = `<i class="fas fa-check"></i> ${question.options[question.answer]}`;
        reviewItem.appendChild(correctAnswer);
        
        if (userAnswer !== -1 && !isCorrect) {
            const userAnswerElement = document.createElement('div');
            userAnswerElement.className = 'review-answer wrong';
            userAnswerElement.innerHTML = `<i class="fas fa-times"></i> ${question.options[userAnswer]}`;
            reviewItem.appendChild(userAnswerElement);
        } else if (userAnswer === -1) {
            const skippedAnswer = document.createElement('div');
            skippedAnswer.className = 'review-answer user';
            skippedAnswer.innerHTML = `<i class="fas fa-forward"></i> Skipped`;
            reviewItem.appendChild(skippedAnswer);
        }
        
        if (question.hint) {
            const hintElement = document.createElement('div');
            hintElement.className = 'review-hint';
            hintElement.innerHTML = `<i class="fas fa-lightbulb"></i> ${question.hint}`;
            reviewItem.appendChild(hintElement);
        }
        
        elements.reviewQuestions.appendChild(reviewItem);
    });
}

function restartQuiz() {
    elements.resultsScreen.classList.remove('active');
    elements.categoryScreen.classList.add('active');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);