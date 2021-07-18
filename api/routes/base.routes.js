const { Router } = require('express');
const bcrypt = require('bcrypt');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const requireAdmin = require('../../middleware/require_admin.middleware');

const router = Router();

const SALT_ROUNDS = 10;

router.post('/get_quiz', async (req, res) => {
    try {
        let quiz;
        if (req.body.id) {
            quiz = await Quiz.findById(req.body.id);
        } else {
            const length = await Quiz.countDocuments();
            quiz = await Quiz.findOne().skip(~~(Math.random() * length));
        }

        const { question, answers, id } = quiz;
        res.status(200).json({ question, answers, id });
    } catch (e) {
        res.status(500).json(e);
    }
});

router.post('/get_quiz_answer', async (req, res) => {
    try {
        if (req.body.id) {
            const { correct } = await Quiz.findById(req.body.id);
            res.status(200).json({ correct });
        } else {
            res.status(400).message('There must be an id in the request');
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

router.post('/quick_setup', async (req, res) => {
    try {
        await User.insertMany([
            {
                username: 'admin',
                password: await bcrypt.hash('1111', SALT_ROUNDS),
                isAdmin: true,
            },
        ]);
        await Quiz.insertMany([
            {
                question: '2*2',
                answers: ['1', '2', '3', '4'],
                correct: 3,
            },
            {
                question: '2-2',
                answers: ['1', '0', '3', '4'],
                correct: 1,
            },
            {
                question: '2+2',
                answers: ['1', '2', '4', '2'],
                correct: 2,
            },
            {
                question: '2/2',
                answers: ['1', '2', '3', '4'],
                correct: 0,
            },
        ]);

        res.status(201).json({ message: 'ok' });
    } catch (e) {
        res.status(500).json(e);
    }
});

router.post('/add_quiz', requireAdmin, async (req, res) => {
    try {
        const quiz = req.body;
        if (!quiz)
            return res.status(400).json({ message: 'Missing quiz data' });
        if (!quiz.question)
            return res.status(400).json({ message: 'Missing quiz question' });
        if (!quiz.answers)
            return res.status(400).json({ message: 'Missing quiz answers' });
        if (!quiz.correct)
            return res.status(400).json({ message: 'Missing quiz correct' });
        if (!Array.isArray(quiz.answers))
            return res.status(400).json({ message: 'Wrong answers format' });
        if (quiz.question.length > 50)
            return res.status(400).json({ message: 'Too big question (> 50)' });
        if (!quiz.answers.every(answer => answer.length <= 30))
            return res.status(400).json({ message: 'Too big answer (> 30)' });
        if (
            quiz.value < 0 ||
            quiz.value >= quiz.length ||
            Number.isInteger(quiz.value)
        )
            return res.status(400).json({ message: 'Wrong correct answer' });

        await Quiz.insertMany([quiz]);
        res.status(201).json({ message: 'ok' });
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;
