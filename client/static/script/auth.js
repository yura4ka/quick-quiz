const username = document.getElementById('username');
const password = document.getElementById('password');

document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
        el.classList.remove('wrong');
    });
});

document.getElementById('login').onclick = async () => {
    if (!username.value || username.value.length > 15) {
        username.classList.add('wrong');
        return false;
    }
    if (!password.value) {
        password.classList.add('wrong');
        return false;
    }

    if (await login({ username: username.value, password: password.value }))
        return location.replace('/admin');

    username.classList.add('wrong');
    password.classList.add('wrong');
};

window.onload = async () => {
    if (await checkAdmin()) location.replace('/admin');
};
