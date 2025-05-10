
# Quiz App

A web-based trivia quiz application that challenges users with questions across three categories: General Knowledge, Science, and History. The app features a clean, responsive interface, a 30-second timer per question, tailored hints, a review system, dark/light mode, sound effects, and confetti for high scores. Questions are stored in a local `questions.json` file, with 30 questions per category, randomly selecting 10 per quiz for variety.

## Features

- **Multiple Categories**: Choose from General Knowledge, Science, or History.
- **Randomized Questions**: Each quiz randomly selects 10 questions from a pool of 30 per category, ensuring variety.
- **Tailored Hints**: Every question includes a specific, non-revealing hint (e.g., "This city is known as the 'City of Light'." for Paris).
- **Timer**: 30 seconds per question, with a warning sound and visual cue in the last 5 seconds.
- **Scoring & Review**: Tracks correct/incorrect answers, displays a percentage score, and offers a detailed review with questions, answers, and hints.
- **Responsive Design**: Works on desktop and mobile devices.
- **Dark/Light Mode**: Toggle between themes, saved in `localStorage`.
- **Sound Effects**: Optional sounds for correct/incorrect answers and timer warnings, toggleable and saved in `localStorage`.
- **Confetti Celebration**: Triggered for scores of 80% or higher.
- **Local Data**: Uses a `questions.json` file for questions, eliminating external API dependencies.

## Demo

[Link to deployed app, e.g., Netlify, GitHub Pages]

## Screenshots

[Add screenshots of the category selection, quiz, results, and review screens if desired]

## Installation

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- A local server for testing (e.g., VS Code Live Server, `http-server`, or Python’s `http.server`).
- [Node.js](https://nodejs.org/) (optional, for `http-server`).
- [Git](https://git-scm.com/) (optional, for cloning the repository).

### Steps

1. **Clone the Repository** (or download the project files):
   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app
   ```

2. **Set Up a Local Server**:
   - **Option 1: VS Code Live Server**:
     - Open the project in VS Code.
     - Right-click `index.html` and select "Open with Live Server."
   - **Option 2: `http-server`**:
     - Install globally: `npm install -g http-server`
     - Run: `http-server -p 8080`
     - Access at `http://localhost:8080`
   - **Option 3: Python**:
     - Run: `python -m http.server 8080`
     - Access at `http://localhost:8080`

3. **Verify File Structure**:
   Ensure the following files are in the project root:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `data/questions.json`
  

4. **Test the App**:
   - Open `http://localhost:8080` in your browser.
   - Select a category, play the quiz, and verify features (hints, timer, review, etc.).

