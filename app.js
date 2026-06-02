require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const userRoutes = require('./src/routes/userRoutes');
const comentarioRoutes = require('./src/routes/comentarioRoutes');

const app = express();
app.use(express.json());

// --- CONFIGURAÇÃO DO SWAGGER ---
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API rest utilizando node.js e express',
      version: '1.0.0',
      description: 'API REST desenvolvida em Node.js, focada no gerenciamento de usuários e publicações de comentários por meio de um CRUD com autenticação de usuário.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  // Aponta para todos os arquivos de rotas — o swagger-jsdoc lê os comentários JSDoc deles
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Rota da documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// --------------------------------

// Conexão com o Banco de Dados
const conectarBanco = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONECTADO ao banco de dados');
  } catch (err) {
    console.log('ERRO ao conectar com o banco de dados:', err.message);
  }
};
conectarBanco();

// Rotas da aplicação
app.use('/api/users', userRoutes);
app.use('/api/comentarios', comentarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));