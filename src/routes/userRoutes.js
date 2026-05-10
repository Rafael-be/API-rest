const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControler'); 

// Rota para criar um novo usuário
router.post('/cadastro', userController.cadastro);// No Talend: POST http://localhost:3000/api/users/cadastro

// Rota para entrar no sistema (Login)
router.post('/login', userController.login);// No Talend: POST http://localhost:3000/api/users/login

//Rota para mostrar todos os usuários
router.get('/mostrar', userController.mostrarUsuarios); // No Talend: GET http://localhost:3000/api/users/mostrar


module.exports = router;