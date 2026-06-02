const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Comentários
 *   description: >
 *     Endpoints para gerenciamento completo de comentários. Inclui criação, listagem,
 *     edição e exclusão. As operações de escrita são protegidas por autenticação JWT,
 *     e apenas o autor do comentário pode editá-lo ou removê-lo.
 */

/**
 * @swagger
 * /api/comentarios/criar:
 *   post:
 *     summary: Publica um novo comentário (Requer Token)
 *     description: >
 *       Cria e publica um novo comentário associado ao usuário autenticado.
 *       O autor é identificado automaticamente pelo Token JWT — não é necessário
 *       informar o ID do usuário no corpo da requisição.
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - conteudo
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Titulo 1
 *               conteudo:
 *                 type: string
 *                 example: Primeiro comentário
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso.
 *       401:
 *         description: Não autorizado (Token ausente ou inválido).
 */
router.post('/criar', autenticacaoMiddleware.verificarToken, comentarioController.criarComentario);

/**
 * @swagger
 * /api/comentarios/mostrar:
 *   get:
 *     summary: Lista todos os comentários publicados
 *     description: >
 *       Retorna todos os comentários do sistema de forma limpa, sem exposição
 *       do campo interno `__v` gerado pelo MongoDB.
 *       Rota pública — não requer autenticação.
 *     tags: [Comentários]
 *     responses:
 *       200:
 *         description: Lista de comentários obtida com sucesso.
 */
router.get('/mostrar', comentarioController.verComentarios);

/**
 * @swagger
 * /api/comentarios/deletar/{id}:
 *   delete:
 *     summary: Remove um comentário (Requer Token — apenas o autor pode deletar)
 *     description: >
 *       Exclui permanentemente um comentário pelo seu ID. O sistema valida se o usuário
 *       autenticado é o **autor do comentário** antes de permitir a exclusão —
 *       tentativas de deletar comentários alheios retornam `403 Forbidden`.
 *       O ID do comentário pode ser obtido na rota `GET /api/comentarios/mostrar`.
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do comentário gerado pelo MongoDB
 *         example: 64b8f36c53e5e412a8a7c2d1
 *     responses:
 *       200:
 *         description: Comentário removido com sucesso.
 *       403:
 *         description: Proibido — você não é o autor deste comentário.
 *       404:
 *         description: Comentário não encontrado.
 */
router.delete('/deletar/:id', autenticacaoMiddleware.verificarToken, comentarioController.deletarComentario);

/**
 * @swagger
 * /api/comentarios/editar/{id}:
 *   patch:
 *     summary: Edita um comentário existente (Requer Token — apenas o autor pode editar)
 *     description: >
 *       Atualiza o título e/ou conteúdo de um comentário pelo seu ID. Assim como na exclusão,
 *       o sistema verifica se o usuário autenticado é o **autor do comentário** —
 *       tentativas de editar comentários alheios retornam `403 Forbidden`.
 *       Apenas os campos enviados no corpo serão atualizados.
 *     tags: [Comentários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do comentário gerado pelo MongoDB
 *         example: 64b8f36c53e5e412a8a7c2d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Titulo Atualizado
 *               conteudo:
 *                 type: string
 *                 example: Conteúdo modificado
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso.
 *       403:
 *         description: Proibido — você não tem permissão para editar este comentário.
 *       404:
 *         description: Comentário não encontrado.
 */
router.patch('/editar/:id', autenticacaoMiddleware.verificarToken, comentarioController.editarComentario);

module.exports = router;