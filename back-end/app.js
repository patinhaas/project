const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// Rota para o cadastro de usuários
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'Email já cadastrado, por favor, escolha outro.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ msg: 'Usuário cadastrado com sucesso', user });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    let errorMsg = 'Erro ao registrar usuário';
    if (error.code === 'P2002') {
      errorMsg = 'Email já cadastrado, por favor, escolha outro.';
    } 

    res.status(500).json({ msg: errorMsg });
  }
});

// Rota para o login de usuários
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }

    res.status(200).json({ msg: 'Login bem-sucedido', user });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ msg: 'Erro ao fazer login' });
  }
});

// Rota para criar uma doação
app.post('/register/donations', async (req, res) => {
  const { name, photoUrl, description, contactNumber, userId } = req.body;

  try {
    const donation = await prisma.donation.create({
      data: {
        name,
        photoUrl,
        description,
        contactNumber,
        userId,
      },
    });

    res.status(200).json({ msg: 'Doação cadastrada com sucesso', donation });
  } catch (error) {
    console.error('Erro ao cadastrar doação:', error);
    res.status(500).json({ msg: 'Erro ao cadastrar doação' });
  }
});

// Rota para listar todas as doações de um usuário
app.get('/donations/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: parseInt(userId) },
    });
    res.status(200).json(donations);
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ msg: 'Erro ao buscar doações' });
  }
});

// Rota para atualizar uma doação
app.put('/donations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, photoUrl, description, contactNumber } = req.body;

  try {
    const donation = await prisma.donation.update({
      where: { id: parseInt(id) },
      data: { name, photoUrl, description, contactNumber },
    });

    res.status(200).json({ msg: 'Doação atualizada com sucesso', donation });
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    res.status(500).json({ msg: 'Erro ao atualizar doação' });
  }
});

// Rota para deletar uma doação
app.delete('/donations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.donation.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ msg: 'Doação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar doação:', error);
    res.status(500).json({ msg: 'Erro ao deletar doação' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
