const express = require('express');
const router = express.Router();
const { Quiz } = require('../models/quiz');


router.get('/', async (req, res) => { 
    res.render('quiz/quiz');
});


router.get('/questions', async (req, res) => {
    try {
        const questions = await Quiz.find().select('-correctAnswer');
        res.json(questions);
    } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
        res.status(500).send('Server error when fetching questions');
    }
});


router.post('/submit', async (req, res) => {
    try {
        const { submissions, startTime, endTime } = req.body; 

        const start = new Date(startTime);
        const end = new Date(endTime);
        const timeTaken = end - start;

        let score = 0;
        for (const submission of submissions) {
            const question = await Quiz.findById(submission.questionId);
            if (question.correctAnswer === submission.answerIndex) {
                score++;
            }
        }

        const result = {
            score: score,
            total: submissions.length,
            percentage: (score / submissions.length) * 100,
            timeTaken: timeTaken
        };

        res.json(result);
    } catch (error) {
        console.error('Failed to process quiz submission:', error);
        res.status(500).send('Server error when processing submission');
    }
});


module.exports = router;
