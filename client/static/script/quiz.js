const answerTemplate = document.getElementById('answer_template');
const variants = document.getElementById('answers');
const question = document.getElementById('question');
const mainButton = document.getElementById('submit');

let id = {};
let chosenAnswer = 0;
let _id;

function createAnswer(number, text) {
    const input = answerTemplate.content.querySelector('p > input');
    input.value = number;
    input.id = `answer_${number}`;

    const label = answerTemplate.content.querySelector('p > label');
    label.setAttribute('for', `answer_${number}`);
    label.innerHTML = `${text}`;

    const answer = answerTemplate.content.cloneNode(true);
    variants.appendChild(answer);
}

async function fillQuiz() {
    mainButton.onclick = checkAnswer;
    mainButton.innerText = 'Submit';
    mainButton.disabled = true;

    const response = await sendRequest('POST', `api/get_quiz`, false, id);
    const quiz = response.json;
    _id = quiz.id;

    question.innerText = `${quiz.question}`;
    variants.innerHTML = '';
    quiz.answers.forEach((ans, i) => createAnswer(i, ans));

    if (!location.search)
        window.history.pushState('', '', `${location.href}?id=${_id}`);
    id = { id: getIdFromQuery() };
}

function toggleInputs(state) {
    variants.querySelectorAll('input').forEach(input => {
        input.disabled = !state;
    });
}

async function checkAnswer() {
    const { json } = await sendRequest(
        'POST',
        `api/get_quiz_answer`,
        false,
        id
    );
    const { correct } = json;
    const p = variants.querySelectorAll('p');
    p[correct].classList.add('correct');

    if (correct !== chosenAnswer) {
        p[chosenAnswer].classList.add('wrong');
    }

    changeUserStats(correct === chosenAnswer);
    toggleInputs(false);
    mainButton.onclick = nextQuiz;
    mainButton.innerText = 'Next';
}

function onAnswerClicked(el) {
    mainButton.disabled = false;
    chosenAnswer = +el.value;
}

function nextQuiz() {
    id = {};
    fillQuiz().then(() => {
        window.history.pushState('', '', `${location.origin}/quiz?id=${_id}`);
        id = { id: getIdFromQuery() };
    });
}

fillQuiz();
