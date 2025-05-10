// Quiz Questions - Randomized
const quizData = {
    general: [
        {
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            answer: 2,
            hint: "This city is known as the 'City of Light'."
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: 1,
            hint: "It's named after the Roman god of war."
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: 2,
            hint: "He was also an inventor and scientist."
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            answer: 3,
            hint: "It covers about one-third of the Earth's surface."
        },
        {
            question: "Which country is home to the kangaroo?",
            options: ["New Zealand", "South Africa", "Australia", "Brazil"],
            answer: 2,
            hint: "It's also home to the Great Barrier Reef."
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            answer: 2,
            hint: "It comes from the Latin word 'aurum'."
        },
        {
            question: "Which language has the most native speakers?",
            options: ["English", "Hindi", "Spanish", "Mandarin Chinese"],
            answer: 3,
            hint: "It's the official language of China."
        },
        {
            question: "What is the tallest mountain in the world?",
            options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Denali"],
            answer: 2,
            hint: "It's located in the Himalayas."
        },
        {
            question: "Which country invented tea?",
            options: ["India", "China", "England", "Japan"],
            answer: 1,
            hint: "It has the oldest continuous civilization."
        },
        {
            question: "What is the largest desert in the world?",
            options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
            answer: 3,
            hint: "It's located at the South Pole."
        }
    ],
    science: [
        {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "NaCl", "O2"],
            answer: 0,
            hint: "It contains two hydrogen atoms and one oxygen atom."
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Quartz"],
            answer: 2,
            hint: "It's a form of carbon."
        },
        {
            question: "Which gas is most abundant in the Earth's atmosphere?",
            options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
            answer: 2,
            hint: "It makes up about 78% of the air we breathe."
        },
        {
            question: "What is the atomic number of oxygen?",
            options: ["6", "8", "16", "32"],
            answer: 1,
            hint: "It's an even number between 6 and 10."
        },
        {
            question: "Which planet is closest to the Sun?",
            options: ["Venus", "Earth", "Mars", "Mercury"],
            answer: 3,
            hint: "It's the smallest planet in our solar system."
        },
        {
            question: "What is the study of living organisms called?",
            options: ["Geology", "Biology", "Chemistry", "Physics"],
            answer: 1,
            hint: "It starts with a 'B'."
        },
        {
            question: "Which element is liquid at room temperature?",
            options: ["Mercury", "Bromine", "Both", "Neither"],
            answer: 2,
            hint: "There are two elements that fit this description."
        },
        {
            question: "What is the speed of light?",
            options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
            answer: 0,
            hint: "It's approximately 186,000 miles per second."
        },
        {
            question: "What is the main component of the Sun?",
            options: ["Liquid lava", "Hydrogen gas", "Oxygen gas", "Rock"],
            answer: 1,
            hint: "It's the lightest element."
        },
        {
            question: "How many bones are in the human body?",
            options: ["106", "206", "306", "406"],
            answer: 1,
            hint: "Babies have more bones that fuse together."
        }
    ],
    history: [
        {
            question: "In which year did World War II end?",
            options: ["1943", "1945", "1947", "1950"],
            answer: 1,
            hint: "It ended after the surrender of Japan."
        },
        {
            question: "Who was the first president of the United States?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "Abraham Lincoln"],
            answer: 2,
            hint: "His face is on the one-dollar bill."
        },
        {
            question: "Which ancient civilization built the pyramids?",
            options: ["Greeks", "Romans", "Egyptians", "Mayans"],
            answer: 2,
            hint: "They were located along the Nile River."
        },
        {
            question: "When was the Declaration of Independence signed?",
            options: ["1774", "1776", "1781", "1787"],
            answer: 1,
            hint: "It happened during the American Revolution."
        },
        {
            question: "Which empire was ruled by Julius Caesar?",
            options: ["Greek", "Roman", "Persian", "Ottoman"],
            answer: 1,
            hint: "It was centered around the Mediterranean."
        },
        {
            question: "Who invented the telephone?",
            options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
            answer: 1,
            hint: "He was a Scottish-born scientist."
        },
        {
            question: "Which year did the Titanic sink?",
            options: ["1905", "1912", "1918", "1923"],
            answer: 1,
            hint: "It happened in April of that year."
        },
        {
            question: "Who was the first woman to fly solo across the Atlantic?",
            options: ["Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Jacqueline Cochran"],
            answer: 0,
            hint: "She disappeared during a later flight."
        },
        {
            question: "Which ancient wonder was located in Babylon?",
            options: ["Great Pyramid", "Hanging Gardens", "Colossus of Rhodes", "Lighthouse of Alexandria"],
            answer: 1,
            hint: "They were supposedly built for a homesick queen."
        },
        {
            question: "When did the Berlin Wall fall?",
            options: ["1985", "1989", "1991", "1993"],
            answer: 1,
            hint: "It marked the end of the Cold War era."
        }
    ]
};

// DOM Elements
const elements = {
    // Screens
    loadingScreen: document.getElementById('loading-screen'),
    categoryScreen: document.getElementById('category-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    reviewScreen: document.getElementById('review-screen'),
    
    // Quiz Elements
    questionNumber: document.getElementById('question-number'),
    categoryName: document.getElementById('category-name'),
    timerDisplay: document.getElementById('time'),
    progressBar: document.getElementById('progress-bar'),
    questionText: document.getElementById('question'),
    optionsContainer: document.getElementById('options'),
    nextButton: document.getElementById('next-btn'),
    hintButton: document.getElementById('hint-btn'),
    
    // Results Elements
    scorePercent: document.getElementById('score-percent'),
    scoreMessage: document.getElementById('score-message'),
    correctAnswers: document.getElementById('correct-answers'),
    wrongAnswers: document.getElementById('wrong-answers'),
    timeTaken: document.getElementById('time-taken'),
    reviewButton: document.getElementById('review-btn'),
    restartButton: document.getElementById('restart-btn'),
    
    // Review Elements
    backToResults: document.getElementById('back-to-results'),
    reviewQuestions: document.getElementById('review-questions'),
    
    // Modal
    hintModal: document.getElementById('hint-modal'),
    hintText: document.getElementById('hint-text'),
    closeModal: document.querySelector('.close-modal'),
    
    // Audio
    correctSound: document.getElementById('correct-sound'),
    wrongSound: document.getElementById('wrong-sound'),
    timerSound: document.getElementById('timer-sound'),
    
    // Theme Toggle
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

// Initialize the app
function init() {
    // Set initial theme and sound
    setTheme(state.darkMode);
    setSound(state.soundEnabled);
    
    // Set up event listeners
    setupEventListeners();
    
    // Simulate loading
    setTimeout(() => {
        elements.loadingScreen.classList.remove('active');
        elements.categoryScreen.classList.add('active');
    }, 1500);
}

function setupEventListeners() {
    // Category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            selectCategory(category);
        });
    });
    
    // Next question button
    elements.nextButton.addEventListener('click', nextQuestion);
    
    // Hint button
    elements.hintButton.addEventListener('click', showHint);
    
    // Modal close button
    elements.closeModal.addEventListener('click', closeModal);
    elements.hintModal.addEventListener('click', (e) => {
        if (e.target === elements.hintModal) closeModal();
    });
    
    // Results buttons
    elements.reviewButton.addEventListener('click', showReview);
    elements.restartButton.addEventListener('click', restartQuiz);
    
    // Review back button
    elements.backToResults.addEventListener('click', () => {
        elements.reviewScreen.classList.remove('active');
        elements.resultsScreen.classList.add('active');
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Sound toggle
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
    
    // Get and shuffle questions
    state.questions = [...quizData[category]];
    shuffleArray(state.questions);
    
    // Take first 10 questions
    state.questions = state.questions.slice(0, 10);
    
    // Reset quiz state
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.userAnswers = new Array(state.questions.length).fill(null);
    state.timeLeft = 30;
    
    // Update UI
    elements.categoryScreen.classList.remove('active');
    elements.quizScreen.classList.add('active');
    
    // Start quiz
    startQuiz();
}

function startQuiz() {
    state.startTime = Date.now();
    showQuestion();
    startTimer();
}

function showQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    
    // Update progress
    const progress = (state.currentQuestionIndex / state.questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.questionNumber.textContent = `Q${state.currentQuestionIndex + 1}/${state.questions.length}`;
    elements.categoryName.textContent = state.currentCategory.charAt(0).toUpperCase() + state.currentCategory.slice(1);
    
    // Update question
    elements.questionText.textContent = question.question;
    
    // Clear options
    elements.optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.answer = index;
        
        // Mark if already answered
        if (state.userAnswers[state.currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', selectAnswer);
        elements.optionsContainer.appendChild(optionElement);
    });
    
    // Reset timer
    resetTimer();
    
    // Disable next button if not answered
    elements.nextButton.disabled = state.userAnswers[state.currentQuestionIndex] === null;
    elements.nextButton.classList.toggle('disabled', state.userAnswers[state.currentQuestionIndex] === null);
}

function selectAnswer(e) {
    const selectedOption = e.target;
    const selectedAnswer = parseInt(selectedOption.dataset.answer);
    
    // Mark selected option
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    selectedOption.classList.add('selected');
    
    // Store user's answer
    state.userAnswers[state.currentQuestionIndex] = selectedAnswer;
    
    // Enable next button
    elements.nextButton.disabled = false;
    elements.nextButton.classList.remove('disabled');
}

function nextQuestion() {
    // Check if answer is correct
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
    
    // Move to next question or finish
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
        
        // Play tick sound when time is running low
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
    
    // Change color when time is running low
    if (state.timeLeft <= 10) {
        elements.timerDisplay.style.color = 'var(--danger-color)';
    } else {
        elements.timerDisplay.style.color = 'inherit';
    }
}

function handleTimeOut() {
    // Mark question as unanswered if not answered
    if (state.userAnswers[state.currentQuestionIndex] === null) {
        state.userAnswers[state.currentQuestionIndex] = -1; // -1 represents skipped
    }
    
    // Auto proceed to next question or finish
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
    
    // Calculate results
    calculateResults();
    
    // Show results screen
    elements.quizScreen.classList.remove('active');
    elements.resultsScreen.classList.add('active');
    
    // Show confetti if score is high
    if (state.score >= state.questions.length * 0.8) {
        startConfetti();
        setTimeout(stopConfetti, 3000);
    }
}

function calculateResults() {
    const totalQuestions = state.questions.length;
    const percentage = Math.round((state.score / totalQuestions) * 100);
    const timeSpent = Math.floor((state.endTime - state.startTime) / 1000);
    
    // Update results UI
    elements.scorePercent.textContent = `${percentage}%`;
    elements.correctAnswers.textContent = state.score;
    elements.wrongAnswers.textContent = totalQuestions - state.score;
    elements.timeTaken.textContent = `${timeSpent}s`;
    
    // Set score message
    if (percentage >= 90) {
        elements.scoreMessage.textContent = "Excellent!";
    } else if (percentage >= 70) {
        elements.scoreMessage.textContent = "Great Job!";
    } else if (percentage >= 50) {
        elements.scoreMessage.textContent = "Good Effort!";
    } else {
        elements.scoreMessage.textContent = "Keep Practicing!";
    }
    
    // Animate score circle
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
    elements.hintText.textContent = currentQuestion.hint;
    elements.hintModal.classList.add('active');
}

function closeModal() {
    elements.hintModal.classList.remove('active');
}

function showReview() {
    elements.resultsScreen.classList.remove('active');
    elements.reviewScreen.classList.add('active');
    
    // Clear previous review
    elements.reviewQuestions.innerHTML = '';
    
    // Add all questions with answers
    state.questions.forEach((question, index) => {
        const userAnswer = state.userAnswers[index];
        const isCorrect = userAnswer === question.answer;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        // Add question
        const questionElement = document.createElement('div');
        questionElement.className = 'review-question';
        questionElement.textContent = `${index + 1}. ${question.question}`;
        reviewItem.appendChild(questionElement);
        
        // Add correct answer
        const correctAnswer = document.createElement('div');
        correctAnswer.className = 'review-answer correct';
        correctAnswer.innerHTML = `<i class="fas fa-check"></i> ${question.options[question.answer]}`;
        reviewItem.appendChild(correctAnswer);
        
        // Add user's answer if different
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
        
        // Add hint if available
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
        