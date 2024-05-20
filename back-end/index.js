require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const functions = require('firebase-functions');

const app = express();

// Configurar o Express para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Inicialização do Firebase Authentication
const auth = admin.auth();

// Middleware para autenticação do usuário
async function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

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

// Definir rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Definir rota para a página de cadastro
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

// Definir rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
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

//create user
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'As senhas não conferem' });
    }

    try {
      const userRecord = await auth.createUser({
        displayName: name,
        email: email,
        password: password
      });

      res.status(200).json({ msg: 'Usuário cadastrado com sucesso', user: userRecord });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ msg: 'Erro ao registrar usuário' });
    }
  });

// Rota para verificar o token JWT e retornar informações do usuário
app.post("/auth/user", verifyToken, async (req, res) => {
  const { email } = req.body;

  try {
    const userRecord = await auth.getUserByEmail(email);
    res.status(200).json({ msg: "Autenticação realizada com sucesso", user: userRecord });
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
