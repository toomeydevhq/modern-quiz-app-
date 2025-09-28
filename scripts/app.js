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
    soundToggle: document.getElementById('sound-toggle'),
    categoriesGrid: document.getElementById('categories-grid'),
    categorySearch: document.getElementById('category-search'),
    clearSearch: document.getElementById('clear-search'),
    noResults: document.getElementById('no-results'),
    adminBtn: document.getElementById('admin-btn'),
    settingsModal: document.getElementById('settings-modal'),
    questionsCount: document.getElementById('questions-count'),
    customQuestions: document.getElementById('custom-questions'),
    timerSetting: document.getElementById('timer-setting'),
    availableCount: document.getElementById('available-count'),
    startQuizBtn: document.getElementById('start-quiz'),
    cancelSettings: document.getElementById('cancel-settings'),
    closeSettings: document.querySelector('.close-settings'),
    exitQuiz: document.getElementById('exit-quiz'),
    homeBtn: document.getElementById('home-btn'),
    exitModal: document.getElementById('exit-modal'),
    confirmExit: document.getElementById('confirm-exit'),
    cancelExit: document.getElementById('cancel-exit'),
    toast: document.getElementById('toast'),
    toastMessage: document.querySelector('.toast-message'),
    toastClose: document.querySelector('.toast-close')
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
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    categories: {},
    questionsData: {},
    questionsPerQuiz: 10,
    timerDuration: 30,
    isTimerEnabled: true,
    selectedCategory: null
};

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toast = elements.toast;
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Set message and type
    elements.toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    switch(type) {
        case 'success':
            toastIcon.className = 'toast-icon fas fa-check-circle';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon fas fa-exclamation-triangle';
            break;
        case 'error':
            toastIcon.className = 'toast-icon fas fa-times-circle';
            break;
        default:
            toastIcon.className = 'toast-icon fas fa-info-circle';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after duration
    setTimeout(() => {
        hideToast();
    }, duration);
}

function hideToast() {
    elements.toast.classList.remove('show');
}

// Data Management
class QuizDataManager {
    constructor() {
        this.storageKey = 'brainyquiz-data';
    }

   async loadData() {
    try {
        console.log('Starting to load quiz data...');

        // Load from localStorage (admin data)
        let localCategories = {};
        let localQuestions = {};
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            console.log('Found data in localStorage');
            const data = JSON.parse(savedData);
            localCategories = data.categories || {};
            localQuestions = data.questions || {};
        }

        // Load categories from JSON file (unencoded)
        const categoriesResponse = await fetch('./data/categories.json');
        if (!categoriesResponse.ok) {
            throw new Error(`Categories file not found: ${categoriesResponse.status}`);
        }
        let fileCategories = await categoriesResponse.json();
        if (fileCategories.encoded) {
            fileCategories = JSON.parse(atob(fileCategories.data));
            delete fileCategories.watermark; // Remove watermark if encoded
        }

        // Load questions from individual category files
        const fileQuestions = {};
        const categoryKeys = Object.keys(fileCategories);
        
        for (const categoryKey of categoryKeys) {
            try {
                const filename = categoryKey.replace(/\s+/g, '');
                const questionsResponse = await fetch(`./data/questions/${filename}.json`);
                
                if (questionsResponse.ok) {
                    let questions = await questionsResponse.json();
                    if (questions.encoded) {
                        questions = JSON.parse(atob(questions.data));
                        delete questions.watermark; // Remove watermark
                    }
                    fileQuestions[categoryKey] = questions;
                    console.log(`Loaded ${questions.length} questions for ${categoryKey}`);
                } else {
                    console.warn(`No questions file found for ${categoryKey}`);
                    fileQuestions[categoryKey] = [];
                }
            } catch (error) {
                console.warn(`Error loading questions for ${categoryKey}:`, error);
                fileQuestions[categoryKey] = [];
            }
        }

        // Merge categories: localStorage takes precedence
        state.categories = { ...fileCategories, ...localCategories };
        
        // Merge questions: localStorage takes precedence
        state.questionsData = { ...fileQuestions, ...localQuestions };

        console.log('Loaded and merged data:', {
            categoriesCount: Object.keys(state.categories).length,
            questionsCount: Object.keys(state.questionsData).length
        });
    } catch (error) {
        console.error('Error loading quiz data:', error);
        state.categories = {};
        state.questionsData = {};
        showToast('Error loading quiz data: ' + error.message, 'error');
    }
}

    saveData() {
        const data = {
            categories: state.categories,
            questions: state.questionsData,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}

const dataManager = new QuizDataManager();

// Utility function to hide all screens
function hideAllScreens() {
    const screens = [
        elements.loadingScreen,
        elements.categoryScreen,
        elements.quizScreen,
        elements.resultsScreen,
        elements.reviewScreen
    ];
    
    screens.forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
        }
    });
}

// Initialize the app
async function init() {
    console.log('Initializing app...');
    setTheme(state.darkMode);
    setSound(state.soundEnabled);
    
    // Validate critical DOM elements
    if (!elements.quizScreen) {
        console.error('Quiz screen element not found in DOM');
        showToast('Error: Quiz screen element missing in HTML. Please check the markup.', 'error');
        return;
    }
    
    try {
        await dataManager.loadData();
        console.log('Data loaded successfully, setting up UI...');
        setupEventListeners();
        renderCategories();
        
        // Hide loading screen and show category screen
        setTimeout(() => {
            hideAllScreens();
            elements.categoryScreen.classList.add('active');
            console.log('App initialized successfully');
        }, 1000);
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Failed to load quiz data. Please check your data files. Error: ' + error.message, 'error');
    }
}

function setupEventListeners() {
    // Search functionality
    elements.categorySearch.addEventListener('input', debounce(handleSearch, 300));
    elements.clearSearch.addEventListener('click', clearSearch);
    
    // Toast close button
    elements.toastClose.addEventListener('click', hideToast);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Quiz controls
    elements.nextButton.addEventListener('click', nextQuestion);
    elements.hintButton.addEventListener('click', showHint);
    elements.closeModal.addEventListener('click', closeModal);
    elements.hintModal.addEventListener('click', (e) => {
        if (e.target === elements.hintModal) closeModal();
    });
    elements.reviewButton.addEventListener('click', showReview);
    elements.restartButton.addEventListener('click', restartQuiz);
    elements.backToResults.addEventListener('click', () => {
        hideAllScreens();
        elements.resultsScreen.classList.add('active');
    });
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.soundToggle.addEventListener('click', toggleSound);
    
    // Admin button
    if (elements.adminBtn) {
        elements.adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }
    
    // Settings modal and navigation
    elements.questionsCount.addEventListener('change', handleQuestionsCountChange);
    elements.customQuestions.addEventListener('input', handleCustomQuestionsInput);
    elements.timerSetting.addEventListener('change', handleTimerSettingChange);
    elements.startQuizBtn.addEventListener('click', startQuizFromModal);
    elements.cancelSettings.addEventListener('click', closeSettingsModal);
    elements.closeSettings.addEventListener('click', closeSettingsModal);
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) closeSettingsModal();
    });
    elements.exitQuiz.addEventListener('click', showExitConfirmation);
    elements.homeBtn.addEventListener('click', goToHome);
    elements.confirmExit.addEventListener('click', confirmExitQuiz);
    elements.cancelExit.addEventListener('click', cancelExitQuiz);
}

function renderCategories(filteredCategories = null) {
    console.log('Rendering categories...', state.categories);
    
    const categoriesToRender = filteredCategories || Object.keys(state.categories);
    
    // Clear existing categories
    elements.categoriesGrid.innerHTML = '';
    
    // Add category counter
    if (!document.getElementById('category-counter')) {
        const categoryCounter = document.createElement('div');
        categoryCounter.id = 'category-counter';
        categoryCounter.className = 'category-counter';
        elements.categoriesGrid.parentNode.insertBefore(categoryCounter, elements.categoriesGrid);
    }
    
    document.getElementById('category-counter').textContent = 
        `Showing ${categoriesToRender.length} of ${Object.keys(state.categories).length} categories`;
    
    if (categoriesToRender.length === 0) {
        elements.noResults.style.display = 'block';
        elements.categoriesGrid.style.display = 'none';
        console.log('No categories to display');
        return;
    }
    
    elements.noResults.style.display = 'none';
    elements.categoriesGrid.style.display = 'grid';
    
    categoriesToRender.forEach(categoryKey => {
        const category = state.categories[categoryKey];
        const categoryCard = createCategoryCard(categoryKey, category);
        elements.categoriesGrid.appendChild(categoryCard);
    });
    
    console.log(`Rendered ${categoriesToRender.length} categories`);
}

function createCategoryCard(categoryKey, category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.category = categoryKey;
    
    const questionCount = state.questionsData[categoryKey]?.length || 0;
    
    card.innerHTML = `
        <div class="category-icon" style="background: ${category.color}20; color: ${category.color}">
            <i class="fas ${category.icon}"></i>
        </div>
        <h3>${category.name}</h3>
        <p>${questionCount} questions available</p>
        <div class="category-badge">${categoryKey}</div>
    `;
    
    card.addEventListener('click', () => showSettingsModal(categoryKey));
    
    return card;
}

function showSettingsModal(categoryKey) {
    console.log('Showing settings modal for category:', categoryKey);
    
    if (!state.categories[categoryKey]) {
        console.error('Invalid category:', categoryKey);
        showToast('Selected category is invalid. Please try another category.', 'error');
        return;
    }
    
    state.selectedCategory = categoryKey;
    console.log('state.selectedCategory set to:', state.selectedCategory);
    
    // Update available questions count
    const available = state.questionsData[categoryKey]?.length || 0;
    const displayCount = Math.min(state.questionsPerQuiz, available);
    elements.availableCount.textContent = `${displayCount} questions available (max ${available})`;
    
    // Show the settings modal
    elements.settingsModal.classList.add('active');
}

function closeSettingsModal() {
    elements.settingsModal.classList.remove('active');
    // Do NOT reset state.selectedCategory here to preserve it for quiz start
}

function handleQuestionsCountChange() {
    const value = elements.questionsCount.value;
    
    if (value === 'custom') {
        elements.customQuestions.style.display = 'block';
        elements.customQuestions.focus();
    } else {
        elements.customQuestions.style.display = 'none';
        state.questionsPerQuiz = parseInt(value);
        updateAvailableQuestions();
    }
}

function handleCustomQuestionsInput() {
    const value = parseInt(elements.customQuestions.value);
    if (value && value > 0 && value <= 50) {
        state.questionsPerQuiz = value;
        updateAvailableQuestions();
    }
}

function handleTimerSettingChange() {
    const value = parseInt(elements.timerSetting.value);
    state.timerDuration = value;
    state.isTimerEnabled = value > 0;
}

function updateAvailableQuestions() {
    if (state.selectedCategory) {
        const available = state.questionsData[state.selectedCategory]?.length || 0;
        const displayCount = Math.min(state.questionsPerQuiz, available);
        elements.availableCount.textContent = `${displayCount} questions available (max ${available})`;
    }
}

function startQuizFromModal() {
    if (!state.selectedCategory) {
        console.error('No category selected');
        showToast('Please select a category to start the quiz.', 'warning');
        return;
    }
    
    console.log('Starting quiz for category:', state.selectedCategory);
    const selectedCategory = state.selectedCategory; // Capture the category before closing
    closeSettingsModal();
    hideAllScreens();
    elements.loadingScreen.classList.add('active');
    
    // Start the quiz with the captured category
    selectCategory(selectedCategory);
}

async function selectCategory(category) {
    console.log('Selected category:', category);
    
    if (!state.categories[category]) {
        console.error('Invalid category:', category);
        showToast('Invalid category selected. Please try again.', 'error');
        hideAllScreens();
        elements.categoryScreen.classList.add('active');
        return;
    }
    
    state.currentCategory = category;
    
    try {
        let questions = state.questionsData[category] || [];
        console.log(`Found ${questions.length} questions for category: ${category}`);
        
        if (questions.length === 0) {
            showToast('No questions available for this category yet. Please try another category.', 'warning');
            hideAllScreens();
            elements.categoryScreen.classList.add('active');
            return;
        }
        
        // Shuffle questions and select the first N questions
        questions = shuffleArray(questions);
        const maxQuestions = Math.min(state.questionsPerQuiz, questions.length);
        
        if (questions.length > maxQuestions) {
            questions = questions.slice(0, maxQuestions);
        }
        
        // Update state with quiz data
        state.questions = questions;
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.userAnswers = new Array(state.questions.length).fill(null);
        state.timeLeft = state.timerDuration;
        
        console.log('Quiz data prepared, starting quiz...');
        
        // Ensure quiz screen is shown
        hideAllScreens();
        if (!elements.quizScreen) {
            console.error('Quiz screen element not found');
            showToast('Error: Quiz screen not found. Please check the HTML.', 'error');
            elements.categoryScreen.classList.add('active');
            return;
        }
        elements.quizScreen.classList.add('active');
        
        // Start the quiz
        startQuiz();
    } catch (error) {
        console.error('Error loading questions:', error);
        showToast('Failed to load questions. Please try again later.', 'error');
        hideAllScreens();
        elements.categoryScreen.classList.add('active');
    }
}

// Utility function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startQuiz() {
    console.log('Starting quiz with', state.questions.length, 'questions');
    state.startTime = Date.now();
    showQuestion();
    if (state.isTimerEnabled) {
        startTimer();
    } else {
        elements.timerDisplay.style.display = 'none';
        document.querySelector('.quiz-timer i').style.display = 'none';
    }
}

function showQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    console.log('Showing question', state.currentQuestionIndex + 1);
    
    // Update progress bar and question number
    const progress = (state.currentQuestionIndex / state.questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.questionNumber.textContent = `Q${state.currentQuestionIndex + 1}/${state.questions.length}`;
    elements.categoryName.textContent = state.categories[state.currentCategory].name;
    
    // Set question text
    elements.questionText.textContent = question.question;
    elements.optionsContainer.innerHTML = '';
    
    // Shuffle the options for this question
    const shuffledOptions = shuffleArray([...question.options]);
    const correctAnswerIndex = shuffledOptions.indexOf(question.options[question.answer]);
    
    // Create option elements
    shuffledOptions.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.answer = index;
        optionElement.dataset.correctIndex = correctAnswerIndex;
        
        if (state.userAnswers[state.currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', selectAnswer);
        elements.optionsContainer.appendChild(optionElement);
    });
    
    if (state.isTimerEnabled) {
        resetTimer();
    }
    
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
    
    const optionsElements = document.querySelectorAll('.option');
    const correctAnswerIndex = parseInt(optionsElements[0].dataset.correctIndex);
    
    if (userAnswer === correctAnswerIndex) {
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
    state.timeLeft = state.timerDuration;
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
    state.timeLeft = state.timerDuration;
    updateTimerDisplay();
    if (state.isTimerEnabled) {
        startTimer();
    }
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
    
    hideAllScreens();
    elements.resultsScreen.classList.add('active');
    
    elements.timerDisplay.style.display = 'block';
    document.querySelector('.quiz-timer i').style.display = 'inline-block';
    
    if (state.score >= state.questions.length * 0.8) {
        startConfetti(3000);
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
    hideAllScreens();
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
        
        if (!isCorrect && userAnswer !== -1) {
            const userAnswerElement = document.createElement('div');
            userAnswerElement.className = 'review-answer wrong';
            userAnswerElement.innerHTML = `<i class="fas fa-times"></i> ${question.options[userAnswer]}`;
            reviewItem.appendChild(userAnswerElement);
        }
        
        if (question.hint && (!isCorrect || userAnswer === -1)) {
            const hintElement = document.createElement('div');
            hintElement.className = 'review-hint';
            hintElement.innerHTML = `<i class="fas fa-lightbulb"></i> ${question.hint}`;
            reviewItem.appendChild(hintElement);
        }
        
        elements.reviewQuestions.appendChild(reviewItem);
    });
}

function showExitConfirmation() {
    elements.exitModal.classList.add('active');
}

function cancelExitQuiz() {
    elements.exitModal.classList.remove('active');
}

function confirmExitQuiz() {
    clearInterval(state.timer);
    elements.exitModal.classList.remove('active');
    hideAllScreens();
    elements.categoryScreen.classList.add('active');
    
    elements.timerDisplay.style.display = 'block';
    document.querySelector('.quiz-timer i').style.display = 'inline-block';
}

function goToHome() {
    hideAllScreens();
    elements.categoryScreen.classList.add('active');
}

function restartQuiz() {
    hideAllScreens();
    showSettingsModal(state.currentCategory);
}

function handleSearch() {
    const searchTerm = elements.categorySearch.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderCategories();
        return;
    }
    
    const filteredCategories = Object.keys(state.categories).filter(categoryKey => {
        const category = state.categories[categoryKey];
        return category.name.toLowerCase().includes(searchTerm) ||
               categoryKey.toLowerCase().includes(searchTerm);
    });
    
    renderCategories(filteredCategories);
}

function clearSearch() {
    elements.categorySearch.value = '';
    elements.categorySearch.focus();
    renderCategories();
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.categorySearch.focus();
    }
    
    if (e.key === 'Escape' && document.activeElement === elements.categorySearch) {
        clearSearch();
    }
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', init);