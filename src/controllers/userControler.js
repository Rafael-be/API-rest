const User = require('../models/userModel');
const Comentario = require('../models/comentarioModel')
const jwt = require('jsonwebtoken');

/**
 * Cria um token JWT para identificar o usuário autenticado.
 *
 * O token contém apenas o id do usuário e expira em um dia.
 *
 * @param {string|ObjectId} id Identificador do usuário.
 * @returns {string} Token JWT assinado com `JWT_SECRET`.
 */
const criarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'});
};

/**
 * Cadastra um novo usuário e retorna o token de autenticação.
 *
 * @param {Request} req Requisição com `username`, `email`, `password` e `bio` opcional no body.
 * @param {Response} res Resposta HTTP com o usuário criado e o token JWT.
 * @returns {Promise<void>}
 */
exports.cadastro = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    const newUser = await User.create({ username, email, password, bio });

    newUser.password = undefined;

    const token = criarToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      informacoes: { user: newUser }
    });

  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message // .message é uma propriedade que fala qual o erro que aconteceu
    });
  }
};

/**
 * Autentica um usuário existente e retorna um token JWT.
 *
 * @param {Request} req Requisição com `email` e `password` no body.
 * @param {Response} res Resposta HTTP com o usuário autenticado e o token JWT.
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Por favor, informe e-mail e senha' });

    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararSenha(password))) return res.status(401).json({ message: 'E-mail ou senha incorretos' });

    const token = criarToken(usuario._id);
    usuario.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      informacoes: { usuario }
    });
    
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * Lista todos os usuários cadastrados.
 *
 * A senha não é retornada porque o campo `password` possui `select: false` no model.
 *
 * @param {Request} req Requisição HTTP.
 * @param {Response} res Resposta HTTP com a lista de usuários.
 * @returns {Promise<void>}
 */
exports.mostrarUsuarios = async (req, res) => {
  try {

    const usuarios = await User.find();

    res.status(200).json({
      status: 'success',
      resultados: usuarios.length,
      informacoes: { usuarios }
    });
  }
  catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 * Exclui a conta do usuário autenticado e remove seus comentários.
 *
 * Depende do middleware de autenticação para preencher `req.user`.
 *
 * @param {Request} req Requisição autenticada com `user` preenchido pelo middleware.
 * @param {Response} res Resposta HTTP com confirmação da exclusão.
 * @returns {Promise<void>}
 */
exports.deletarConta = async (req, res) => {
  try {

    const idUsuario = req.user._id;
    await Comentario.deleteMany({ autor: idUsuario });
    await User.findByIdAndDelete(idUsuario);

    res.status(200).json({
      status: 'success',
      message: 'Sua conta foi excluída com sucesso. (seus comentários também foram)'
    });
    
  }
  catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao tentar excluir a conta: ' + err.message 
    });
  }
};

/**
 * Atualiza a senha do usuário autenticado após validar a senha atual.
 *
 * A nova senha é atribuída ao documento e salva com `.save()` para acionar o hook
 * de criptografia definido no model.
 *
 * @param {Request} req Requisição autenticada com `senhaAtual` e `novaSenha` no body.
 * @param {Response} res Resposta HTTP com confirmação da alteração.
 * @returns {Promise<void>}
 */
exports.atualizarSenha = async (req, res) => {
  try {

    const { senhaAtual, novaSenha } = req.body;

    const usuario = await User.findById(req.user._id).select('+password');

    const senhaCorreta = await usuario.compararSenha(senhaAtual);
    
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Sua senha atual está incorreta.' });
    }

    usuario.password = novaSenha;
    await usuario.save();

    res.status(200).json({
      status: 'success',
      message: 'Senha atualizada com sucesso!'
    });

  }
  catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

/**
 * Atualiza os dados editáveis do perfil do usuário autenticado.
 *
 * Apenas `username`, `email` e `bio` são aceitos. Campos ausentes permanecem
 * inalterados, e as validações do schema são executadas pelo Mongoose.
 *
 * @param {Request} req Requisição autenticada com campos de perfil no body.
 * @param {Response} res Resposta HTTP com o usuário atualizado.
 * @returns {Promise<void>}
 */
exports.atualizarPerfil = async (req, res) => {
  try {

    const { username, email, bio } = req.body;
    const camposAtualizados = {};

    if (username) camposAtualizados.username = username;
    if (email) camposAtualizados.email = email;
    if (bio) camposAtualizados.bio = bio;

    const usuario = await User.findByIdAndUpdate(req.user._id, camposAtualizados, {new: true,runValidators: true});

    res.status(200).json({
      status: 'success',
      data: { user: usuario }
    });

  }
  catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
