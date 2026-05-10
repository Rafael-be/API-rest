const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControler'); 
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

router.post('/cadastro', userController.cadastro);// No Talend: POST http://localhost:3000/api/users/cadastro

router.post('/login', userController.login);// No Talend: POST http://localhost:3000/api/users/login

router.get('/mostrar', userController.mostrarUsuarios); // No Talend: GET http://localhost:3000/api/users/mostrar

router.delete('/deletar-conta', autenticacaoMiddleware.proteger, userController.deletarConta);// No Talend: DELETE http://localhost:3000/api/users/deletar-conta


module.exports = router;