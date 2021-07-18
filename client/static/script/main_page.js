document.getElementById('start').onclick = async () => {
    const quiz = await sendRequest('POST', `api/get_quiz`);
    location.href += `quiz?id=${quiz.json.id}`;
}

const stats = getUserStats()
document.querySelectorAll('span.stat_span').forEach((el, i) => {
   el.innerHTML = stats[i];
});