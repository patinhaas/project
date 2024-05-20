/* imports */
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin');
const mustache = require('mustache');
const fs = require('fs');

const app = express();
const path = require('path');

// Configurar o Express para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Definir rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Definir rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Configuração do Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Inicialização do Firebase Authentication
const auth = admin.auth();

// Middleware para autenticação do usuário
async function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ msg: "Token não fornecido" });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Erro ao verificar token:", error);
        return res.status(403).json({ msg: "Token inválido" });
    }
}

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem-vindo à nossa API" });
});

// Rota privada para obter informações do usuário
app.get("/user/:id", verifyToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const userRecord = await auth.getUser(userId);
        res.status(200).json({ user: userRecord });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ msg: "Erro ao buscar usuário" });
    }
});

// Rota de registro de usuário
app.post('/auth/register', async (req, res) => {
    const { nome ,email, password, confirmpassword } = req.body;

    // Verifica se o e-mail e a senha foram fornecidos
    if (!email || !password) {
        return res.status(400).json({ msg: "E-mail e senha são obrigatórios" });
    }

    try {
        const userRecord = await auth.createUser({
            nome: nome,
            email: email,
            password: password
        });

        res.status(201).json({ msg: "Usuário registrado com sucesso", user: userRecord });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ msg: "Erro ao registrar usuário" });
    }
});

// Rota de autenticação do usuário
app.post("/auth/user", async (req, res) => {
    const { email, password } = req.body;

    // Verifica se o e-mail e a senha foram fornecidos
    if (!email || !password) {
        return res.status(400).json({ msg: "E-mail e senha são obrigatórios" });
    }

    try {
        const userRecord = await auth.getUserByEmail(email);

        // Autenticar usuário
        const signInResult = await auth.signInWithEmailAndPassword(email, password);
        const token = await signInResult.user.getIdToken();

        res.status(200).json({ msg: "Autenticação realizada com sucesso", token: token, user: userRecord });
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        res.status(500).json({ msg: "Erro ao autenticar usuário" });
    }
});

// Inicie o servidor Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
