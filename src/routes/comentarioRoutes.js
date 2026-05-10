const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController')
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

router.post('/criar',  autenticacaoMiddleware.proteger, comentarioController.criarComentario);// No Talend: POST http://localhost:3000/api/comentarios/criar

router.get('/mostrar', comentarioController.verComentarios);// No Talend: GET http://localhost:3000/api/comentarios/mostrar

router.delete('/deletar/:id', autenticacaoMiddleware.proteger, comentarioController.deletarComentario); // No Talend: DELETE http://localhost:3000/api/comentarios/deletar

module.exports = router;