const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControler');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: >
 *     Endpoints para gerenciamento completo de usuários. Inclui cadastro, autenticação via JWT,
 *     atualização de perfil, troca segura de senha e exclusão de conta com remoção em cascata
 *     de todos os comentários vinculados.
 */

/**
 * @swagger
 * /api/users/cadastro:
 *   post:
 *     summary: Cria uma nova conta de usuário
 *     description: >
 *       Registra um novo usuário no sistema. A senha é armazenada de forma segura utilizando
 *       criptografia unidirecional via **Bcrypt.js** — ela nunca é salva em texto puro no banco de dados.
 *       É recomendado criar ao menos dois usuários para testar as travas de segurança de edição
 *       e exclusão de comentários alheios.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: seu_nome
 *               email:
 *                 type: string
 *                 example: exemplo@endereco.com
 *               password:
 *                 type: string
 *                 example: senha_segura
 *               bio:
 *                 type: string
 *                 example: Bio
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       400:
 *         description: E-mail já cadastrado ou dados inválidos.
 */
router.post('/cadastro', userController.cadastro);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autentica o usuário e gera um Token JWT
 *     description: >
 *       Valida as credenciais do usuário e retorna um **Token JWT** em caso de sucesso.
 *       Este token é necessário para acessar todas as rotas protegidas — copie-o e
 *       envie-o no header `Authorization: Bearer {token}` nas demais requisições.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: exemplo@endereco.com
 *               password:
 *                 type: string
 *                 example: senha_segura
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida. Retorna o Token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: E-mail ou senha incorretos.
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/mostrar:
 *   get:
 *     summary: Lista todos os usuários cadastrados
 *     description: >
 *       Retorna a lista completa de todos os usuários registrados no sistema.
 *       Rota pública — não requer autenticação.
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso.
 */
router.get('/mostrar', userController.mostrarUsuarios);

/**
 * @swagger
 * /api/users/deletar-conta:
 *   delete:
 *     summary: Exclui a conta do usuário autenticado (Requer Token)
 *     description: >
 *       Remove permanentemente a conta do usuário autenticado. Esta operação utiliza
 *       **exclusão em cascata**: todos os comentários publicados pelo usuário são
 *       automaticamente removidos do banco de dados junto com a conta, garantindo a
 *       integridade referencial dos dados.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conta e todos os comentários vinculados removidos com sucesso.
 *       401:
 *         description: Não autorizado (Token inválido ou ausente).
 */
router.delete('/deletar-conta', autenticacaoMiddleware.verificarToken, userController.deletarConta);

/**
 * @swagger
 * /api/users/atualizar-senha:
 *   patch:
 *     summary: Realiza a troca segura de senha com re-autenticação (Requer Token)
 *     description: >
 *       Permite ao usuário autenticado alterar sua senha. Por segurança, é obrigatório
 *       informar a **senha atual** para confirmar a identidade antes de definir a nova senha.
 *       A nova senha é criptografada via Bcrypt.js antes de ser salva.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senhaAtual
 *               - novaSenha
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 example: senha_segura
 *               novaSenha:
 *                 type: string
 *                 example: nova_senha_muito_mais_segura
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso.
 *       400:
 *         description: Senha atual incorreta ou dados inválidos.
 *       401:
 *         description: Não autorizado (Token inválido ou ausente).
 */
router.patch('/atualizar-senha', autenticacaoMiddleware.verificarToken, userController.atualizarSenha);

/**
 * @swagger
 * /api/users/atualizar-perfil:
 *   patch:
 *     summary: Atualiza os dados do perfil do usuário (Requer Token)
 *     description: >
 *       Permite ao usuário autenticado atualizar seu username, email e/ou bio.
 *       Apenas os campos enviados no corpo da requisição serão atualizados —
 *       os demais permanecem inalterados.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: novo_nome
 *               email:
 *                 type: string
 *                 example: novo_email@endereco.com
 *               bio:
 *                 type: string
 *                 example: Nova bio atualizada
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso.
 *       401:
 *         description: Não autorizado (Token inválido ou ausente).
 */
router.patch('/atualizar-perfil', autenticacaoMiddleware.verificarToken, userController.atualizarPerfil);

module.exports = router;