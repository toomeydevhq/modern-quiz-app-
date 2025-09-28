class QuizAdmin {
    constructor() {
        this.currentSection = 'categories';
        this.correctAnswer = 0;
        this.dataManager = {
            storageKey: 'brainyquiz-data',
            loadData() {
                const savedData = localStorage.getItem(this.storageKey);
                return savedData ? JSON.parse(savedData) : { categories: {}, questions: {} };
            },
            saveData(data) {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            }
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderCategories();
        this.populateCategorySelect();
        this.renderQuestions();
        this.showDataPreview();
    }

    loadData() {
        this.data = this.dataManager.loadData();
    }

    saveData() {
        this.dataManager.saveData(this.data);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showSection(e.target.dataset.section);
            });
        });

        // Categories
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.addCategory();
        });

        // Questions
        document.querySelectorAll('.set-correct').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCorrectAnswer(parseInt(e.target.closest('.set-correct').dataset.option));
            });
        });

        document.getElementById('add-question-btn').addEventListener('click', () => {
            this.addQuestion();
        });

        // Data management
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e);
        });

        // Preview tabs
        document.getElementById('preview-categories').addEventListener('click', () => {
            this.showDataPreview('categories');
        });

        document.getElementById('preview-questions').addEventListener('click', () => {
            this.showDataPreview('questions');
        });
    }

    showSection(section) {
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.getElementById(`${section}-section`).classList.add('active');
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        this.currentSection = section;

        if (section === 'preview') {
            this.showDataPreview();
        }
    }

    addCategory() {
        const code = document.getElementById('category-code').value.trim();
        const name = document.getElementById('category-name').value.trim();
        const icon = document.getElementById('category-icon').value.trim();
        const color = document.getElementById('category-color').value;

        if (!code || !name) {
            alert('Please enter both category code and name.');
            return;
        }

        this.data.categories[code] = { name, icon, color };
        this.saveData();
        this.renderCategories();
        this.populateCategorySelect();
        this.clearCategoryForm();

        alert(`Category "${name}" added successfully!`);
    }

    addQuestion() {
        const category = document.getElementById('question-category').value;
        const questionText = document.getElementById('question-text').value.trim();
        const options = [
            document.getElementById('option-1').value.trim(),
            document.getElementById('option-2').value.trim(),
            document.getElementById('option-3').value.trim(),
            document.getElementById('option-4').value.trim()
        ];
        const hint = document.getElementById('question-hint').value.trim();

        if (!category || !questionText || options.some(opt => !opt)) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!this.data.questions[category]) {
            this.data.questions[category] = [];
        }

        this.data.questions[category].push({
            question: questionText,
            options: options,
            answer: this.correctAnswer,
            hint: hint || ''
        });

        this.saveData();
        this.renderQuestions();
        this.clearQuestionForm();

        alert('Question added successfully!');
    }

    setCorrectAnswer(optionIndex) {
        this.correctAnswer = optionIndex;
        document.querySelectorAll('.set-correct').forEach((btn, index) => {
            btn.classList.toggle('active', index === optionIndex);
        });
    }

    renderCategories() {
        const container = document.getElementById('categories-list');
        container.innerHTML = '';

        Object.entries(this.data.categories).forEach(([code, category]) => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <div class="item-header">
                    <strong>${code}</strong>: ${category.name}
                    <div class="item-actions">
                        <button class="icon-btn delete-category" data-code="${code}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div>Icon: ${category.icon}, Color: ${category.color}</div>
            `;
            container.appendChild(item);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.closest('.delete-category').dataset.code;
                this.deleteCategory(code);
            });
        });
    }

    renderQuestions() {
        const container = document.getElementById('questions-list');
        container.innerHTML = '';

        Object.entries(this.data.questions).forEach(([category, questions]) => {
            questions.forEach((question, index) => {
                const item = document.createElement('div');
                item.className = 'question-item';
                item.innerHTML = `
                    <div class="item-header">
                        <strong>${category} - Q${index + 1}</strong>
                        <div class="item-actions">
                            <button class="icon-btn delete-question" data-category="${category}" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div><strong>Q:</strong> ${question.question}</div>
                    <div><strong>A:</strong> ${question.options[question.answer]}</div>
                    ${question.hint ? `<div><strong>Hint:</strong> ${question.hint}</div>` : ''}
                `;
                container.appendChild(item);
            });
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.closest('.delete-question').dataset.category;
                const index = parseInt(e.target.closest('.delete-question').dataset.index);
                this.deleteQuestion(category, index);
            });
        });
    }

    populateCategorySelect() {
        const select = document.getElementById('question-category');
        select.innerHTML = '<option value="">Select a category</option>';
        
        Object.entries(this.data.categories).forEach(([code, category]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${category.name}`;
            select.appendChild(option);
        });
    }

    deleteCategory(code) {
        if (confirm(`Are you sure you want to delete category "${code}"? This will also delete all associated questions.`)) {
            delete this.data.categories[code];
            delete this.data.questions[code];
            this.saveData();
            this.renderCategories();
            this.populateCategorySelect();
            this.renderQuestions();
        }
    }

    deleteQuestion(category, index) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.data.questions[category].splice(index, 1);
            if (this.data.questions[category].length === 0) {
                delete this.data.questions[category];
            }
            this.saveData();
            this.renderQuestions();
        }
    }

    clearCategoryForm() {
        document.getElementById('category-code').value = '';
        document.getElementById('category-name').value = '';
        document.getElementById('category-icon').value = 'fa-code';
        document.getElementById('category-color').value = '#4361ee';
    }

    clearQuestionForm() {
        document.getElementById('question-text').value = '';
        document.getElementById('option-1').value = '';
        document.getElementById('option-2').value = '';
        document.getElementById('option-3').value = '';
        document.getElementById('option-4').value = '';
        document.getElementById('question-hint').value = '';
        this.setCorrectAnswer(0);
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brainyquiz-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = importedData;
                this.saveData();
                this.renderCategories();
                this.populateCategorySelect();
                this.renderQuestions();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing data: Invalid JSON format.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    showDataPreview(type = 'categories') {
        const content = document.getElementById('data-preview-content');
        const categoriesBtn = document.getElementById('preview-categories');
        const questionsBtn = document.getElementById('preview-questions');

        categoriesBtn.classList.toggle('active', type === 'categories');
        questionsBtn.classList.toggle('active', type === 'questions');

        if (type === 'categories') {
            content.textContent = JSON.stringify(this.data.categories, null, 2);
        } else {
            content.textContent = JSON.stringify(this.data.questions, null, 2);
        }
    }
}

// Initialize the admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizAdmin();
});