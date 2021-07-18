async function sendRequest(method, url, isNeedAuth = false, body) {
    return await new Promise(async (resolve) => {
        try {
            const headers = {};
            if (body) {
                headers['Content-type'] = 'application/json';
                body = JSON.stringify(body);
            }
            if (isNeedAuth) {
                headers['Authorization'] = 'Bearer ' + localStorage.getItem('Access-Token');
            }
            const response = await fetch(location.origin + '/' + url, {
                method, headers, body,
            });

            const json = await response?.json() || {};
            resolve({ json, ok: response.ok, status: response.status });
        } catch (e) {
            console.error(e);
        }
    });
}

async function login(user) {
    try {
        const response = await fetch(location.origin + '/api/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            return false;
        }

        localStorage.setItem('Access-Token', response.headers.get('Access-Token'));
        return true;
    }
    catch (e) {
        console.error(e.message);
    }
}

function getIdFromQuery() {
    return location.search.slice(location.search.indexOf('=') + 1);
}

function changeUserStats(isCorrect) {
    const total = +localStorage.getItem('total_questions');
    localStorage.setItem('total_questions', `${total + 1}`);

    const answerType = isCorrect ? 'correct' : 'wrong';

    const answers = +localStorage.getItem(`${answerType}_answers`);
    localStorage.setItem(`${answerType}_answers`, `${answers + 1}`);
}

function getUserStats() {
    return [localStorage.total_questions, localStorage.correct_answers, localStorage.wrong_answers];
}

async function checkAdmin() {
    if (!localStorage.getItem('Access-Token'))
        return false;

    const response = await sendRequest('POST', 'api/check_admin', true);
    return response.ok;
}
