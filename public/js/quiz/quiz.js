const currentLang = document.documentElement.lang;
const localization = {
    en: {
        question: "Question",
        submitQuiz: 'Submit Quiz',
        timeIsUp: 'Time is up!',
        timeLeft: 'Time left:',
        seconds: 'seconds',
        yourScore: 'Your Score:',
        outOf: 'out of',
        percentage: 'Percentage',
        timeTaken: 'Time Taken',
        shareResults: 'Share your results:',
        tryToBeatMe: 'I scored SCORE out of TOTAL on this cool quiz! Try to beat me!',
        notFinished: "You didnt finish every question!"
    },
    ru: {
        question: "Вопрос",
        submitQuiz: 'Завершить викторину',
        timeIsUp: 'Время вышло!',
        timeLeft: 'Осталось времени:',
        seconds: 'секунд',
        yourScore: 'Ваш результат:',
        outOf: 'из',
        percentage: 'Процент',
        timeTaken: 'Затраченное время',
        shareResults: 'Поделитесь своими результатами:',
        tryToBeatMe: 'Я набрал SCORE из TOTAL на этой крутой викторине! Попробуйте набить больше меня!',
        notFinished: "Вы не ответили на все вопросы!"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    fetchQuizQuestions();
});

let startTime;
let quizDuration = 300000; 

async function fetchQuizQuestions() {
    try {
        const response = await fetch('/quiz/questions');
        if (!response.ok) throw new Error('Network response was not ok.');
        
        const questions = await response.json();
        displayQuestions(questions);

        startTime = Date.now();
        startCountdown();
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
    }
}

function displayQuestions(questions) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = ''; 
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <div class="question mb-5">
                <h4>${localization[currentLang].question} ${index + 1}: ${question.questions[currentLang]}</h4>
                ${question.option.map((option, i) => `
                    <label>
                        <input type="radio" name=${question._id} value="${i}"> ${option[currentLang]}
                    </label><br>
                `).join('')}
            </div>
        `;
        container.appendChild(questionElement);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = localization[currentLang].submitQuiz;
    submitButton.classList.add("btn");
    submitButton.classList.add("btn-primary");
    submitButton.classList.add("mb-5");
    submitButton.addEventListener('click', submitQuiz);
    container.appendChild(submitButton);
}

function startCountdown() {
    const timerElement = document.getElementById('timer');
    const countdown = () => {
        const now = Date.now();
        const timeLeft = quizDuration - (now - startTime);

        if (timeLeft <= 0) {
            timerElement.textContent = localization[currentLang].timeIsUp;
            submitQuiz();
            clearInterval(interval);
        } else {
            timerElement.textContent = `${localization[currentLang].timeLeft} ${Math.round(timeLeft / 1000)} ${localization[currentLang].seconds}`;
        }
    };

    countdown(); 
    const interval = setInterval(countdown, 1000);
}

async function submitQuiz() {
    const endTime = Date.now();
    const submissions = [];

    document.querySelectorAll('.question').forEach((questionElement) => {
        const questionId = questionElement.querySelector('input[type="radio"]').name.replace('question', '');
        const answerIndex = questionElement.querySelector('input[type="radio"]:checked')?.value;

        if (answerIndex !== undefined) {
            submissions.push({ questionId, answerIndex: parseInt(answerIndex, 10) });
        } 
    });

    try {
        if (submissions.length == 5) {
            const response = await fetch('/quiz/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    submissions,
                    startTime,
                    endTime
                })
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            const result = await response.json();
            displayResults(result);
            addSocialSharingButtons(result);
        } else {
            alert(localization[currentLang].notFinished);
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
}

function displayResults(result) {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `
        <h3>${localization[currentLang].yourScore} ${result.score} ${localization[currentLang].outOf} ${result.total}</h3>
        <p>${localization[currentLang].percentage}: ${result.percentage.toFixed(2)}%</p>
        <p>${localization[currentLang].timeTaken}: ${Math.round((result.timeTaken) / 1000)} ${localization[currentLang].seconds}</p>
    `;
}

function addSocialSharingButtons(result) {
    const resultsElement = document.getElementById('results');
    const shareMessage = localization[currentLang].tryToBeatMe.replace('SCORE', result.score).replace('TOTAL', result.total);
    const shareUrl = window.location.href;
    const buttonsHtml = `
        <div class="social-sharing mt-3">
            <p>${localization[currentLang].shareResults}</p>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank">FaceBook</a>
            |
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}" target="_blank">WhatsApp</a>
            |
            <a href="https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}" target="_blank">Telegram</a>
        </div>
    `;
    resultsElement.insertAdjacentHTML('beforeend', buttonsHtml);
}
