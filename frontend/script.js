const form = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');

const API_URL = 'http://localhost:3000';

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (data.auth) {

            // salva token
            localStorage.setItem('jwt-token', data.token);

            // REDIRECIONA
            window.location.href = 'grupo.html';

        } else {

            mensagem.textContent = data.message;
        }

    } catch (error) {

        console.error(error);

        mensagem.textContent = 'Erro no servidor';
    }
});