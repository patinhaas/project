const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Diretório onde as imagens serão salvas

const prisma = new PrismaClient();
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir arquivos estáticos
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

app.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ msg: 'Erro ao buscar usuário' });
  }
});

// Rota para atualizar dados do usuário
app.put('/update/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ msg: 'Usuário atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ msg: 'Erro ao atualizar usuário' });
  }
});

// Rota para deletar usuário
app.delete('/delete/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ msg: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ msg: 'Erro ao deletar usuário' });
  }
});

// Rota para criar uma doação
app.post('/register/donations', upload.single('photoUrl'), async (req, res) => {
  const { name, description, contactNumber, userId } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null; // Caminho da foto salva

  try {
    if (!name || !description || !contactNumber || !userId) {
      return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }

    const donation = await prisma.donation.create({
      data: {
        name,
        photoUrl,
        description,
        contactNumber,
        userId: parseInt(userId),
      },
    });

    res.status(200).json({ msg: 'Doação cadastrada com sucesso', donation });
  } catch (error) {
    console.error('Erro ao cadastrar doação:', error);
    res.status(500).json({ msg: 'Erro ao cadastrar doação' });
  }
});

// Rota para buscar doações com base em critérios de filtro
app.get('/api/donations', async (req, res) => {
  const { date, ongName } = req.query;
  const where = {};

  if (date) {
    where.createdAt = {
      gte: new Date(date),
      lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) // Considerando um filtro para o dia todo
    };
  }

  if (ongName) {
    where.ongName = {
      contains: ongName,
      mode: 'insensitive',
    };
  }

  try {
    const donations = await prisma.donation.findMany({
      where,
      orderBy: {
        createdAt: 'desc' // Ordenando por data de criação, do mais recente para o mais antigo
      }
    });
    res.status(200).json(donations);
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ error: 'Erro ao buscar doações' });
  }
});

// Rota para listar todas as doações de um usuário
app.get('/list/donations/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId); // Convertendo o ID do usuário para inteiro

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId }, // Utilizando o ID do usuário corretamente
    });
    res.status(200).json(donations);
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ msg: 'Erro ao buscar doações' });
  }
});

// Rota para obter todas as doações
app.get('/listAll/api/donations', async (req, res) => {
  try {
    const donations = await prisma.donation.findMany(); // Retorna todas as doações
    res.status(200).json(donations);
  } catch (error) {
    console.error('Erro ao buscar todas as doações:', error);
    res.status(500).json({ msg: 'Erro ao buscar todas as doações' });
  }
});

// Rota para atualizar uma doação
app.put('/update/donations/:id', async (req, res) => {
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
app.delete('/delete/donations/:id', async (req, res) => {
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
