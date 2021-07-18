const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

router.get('/quiz', (req, res) => {
    res.sendFile(__dirname + '/pages/quiz.html');
});

router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/pages/login.html');
});

router.get('/quick_setup', (req, res) => {
    res.sendFile(__dirname + '/pages/quick_db_setup.html');
});

router.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/pages/admin.html');
});

module.exports = router;
