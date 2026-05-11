const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend')));

const SEGREDO = 'minha_chave_super_secreta_123';

const usuarioCadastrado = {
    id: 1,
    username: 'aluno',
    password: '123'
};

// LOGIN
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (
        username === usuarioCadastrado.username &&
        password === usuarioCadastrado.password
    ) {

        const token = jwt.sign(
            { userId: usuarioCadastrado.id },
            SEGREDO,
            { expiresIn: '1h' }
        );

        return res.json({
            auth: true,
            token
        });
    }

    return res.status(401).json({
        auth: false,
        message: 'Login inválido'
    });
});

// Middleware
function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não enviado'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SEGREDO, (err, decoded) => {

        if (err) {
            return res.status(403).json({
                message: 'Token inválido'
            });
        }

        req.userId = decoded.userId;

        next();
    });
}

// Rota protegida
app.get('/painel-secreto', verificarToken, (req, res) => {

    res.json({
        message: 'Bem-vindo ao grupo secreto',
        userId: req.userId
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});