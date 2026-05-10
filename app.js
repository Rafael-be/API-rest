require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json()); // Permite que a API entenda arquivos JSON vindos do Talend


const conectarBanco = async () => { // Função assíncrona para conectar ao banco de dados
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONECTADO ao banco de dados');
  } catch (err) {
    console.log('ERRO ao conectar com o banco de dados:', err.message);
  }
};
conectarBanco();


app.use('/api/users', userRoutes);// Toda rota que estiver no userRoutes começará com '/api/users'


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));