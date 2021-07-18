const addAnswerButton = document.getElementById('add_answer');
const submitButton = document.getElementById('submit');
const variants = document.getElementById('answers');

let answersCount = 2;

[...document.querySelectorAll('input[type=text]')].map(input => {
    input.addEventListener('input', () => input.classList.remove('wrong'));
});

function fillAnswer(answer, index = answersCount, isClearText = true) {
    const radioButton = answer.querySelector('input[type=radio]');
    radioButton.id = `answer_${index}`;
    radioButton.value = `${index}`;
    radioButton.checked = false;

    if (isClearText) answer.querySelector('input[type=text]').value = '';
    answer.querySelector('label').setAttribute('for', `answer_${index}`);
    answer
        .querySelector('button')
        .setAttribute('onclick', `deleteAnswer(${index})`);
}

function toggleRemoveButtons(state) {
    variants.querySelectorAll('button').forEach(button => {
        button.disabled = !state;
    });
}

function deleteAnswer(index) {
    if (answersCount <= 2) return false;

    for (let i = index + 1; i < variants.children.length; i++) {
        fillAnswer(variants.children[i], i - 1, false);
    }

    variants.children[index].remove();
    answersCount--;

    if (answersCount <= 2) toggleRemoveButtons(false);
    if (answersCount <= 8) addAnswerButton.disabled = false;
}

addAnswerButton.addEventListener('click', () => {
    if (answersCount >= 8) return false;

    const template = variants.querySelector('p').cloneNode(true);
    fillAnswer(template);

    variants.appendChild(template);
    answersCount++;

    if (answersCount > 2) toggleRemoveButtons(true);
    if (answersCount >= 8) addAnswerButton.disabled = true;
});

function checkQuizData(quiz) {
    const { question, answers, correct } = quiz;
    let isWrongData = false;

    if (!question.value || question.value.length > 50) {
        question.classList.add('wrong');
    }

    answers.forEach(input => {
        if (!input.value || input.value.length > 30) {
            input.classList.add('wrong');
            isWrongData = true;
        }
    });
    if (isWrongData) return false;

    if (!correct) {
        alert("Error! Quiz doesn't have correct answer");
        return false;
    }
    if (
        correct.value < 0 ||
        correct.value >= answers.length ||
        Number.isInteger(correct.value)
    ) {
        alert('Error! Wrong correct answer value');
        return false;
    }

    return true;
}

submitButton.addEventListener('click', async () => {
    const question = document.getElementById('quiz_question');
    const answers = variants.querySelectorAll('label > input');
    const correct = variants.querySelector('input:checked');

    if (!checkQuizData({ question, answers, correct })) return false;

    submitButton.disabled = true;
    addAnswerButton.disabled = true;

    const response = await sendRequest('POST', 'api/add_quiz', true, {
        question: question.value,
        answers: [...answers].map(input => input.value),
        correct: +correct.value,
    });

    if (!response.ok) {
        alert('Error' + response.json.message);
    } else {
        alert('Quiz added successfully');
        location.reload();
    }
});

window.onload = async () => {
    if (!(await checkAdmin())) location.replace('/login');
};
