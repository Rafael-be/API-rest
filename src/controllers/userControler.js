const User = require('../models/userModel');
const Comentario = require('../models/comentarioModel')
const jwt = require('jsonwebtoken');

//O jwt dá um crédito temporário para ter acesso à conta, já o bcrpt criptograda a senha
const criarToken = (id) => {// Criar o Token JWT com o id que será passado ao chamar a função
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'});
  /*retorna a função jwt.sign, que serve para fabricar o token
  Ela tem 3 parâmetros:
  1- O que você quer gerar o token, por exemplo quero gerar um token com o id tal que foi passado. O id é um objeto, por isso as {}
  2- A chave de encriptação que esta no .env
  3- Validade do token. '1d' = 1 dia. Também é um objeto, por isso o {}*/
};

// Cadastro (POST)
exports.cadastro = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    const newUser = await User.create({ username, email, password, bio });

    newUser.password = undefined;// Oculta a senha por segurança

    const token = criarToken(newUser._id); // '_id' é a chave primária que os objetos ganham no mongoDB

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

// LOGIN (POST)
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Por favor, informe e-mail e senha' }); //verifica se tem email e senha escritos

    const usuario = await User.findOne({ email }).select('+password'); // busca a senha no banco de dados (select = false faz ela não aparecer na URL)
    if (!usuario || !(await usuario.compararSenha(password))) return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    //o if de cima verifica se o usuario nãp existe (=== false) e se a função que está no model para comparar as senhas retornar falso, ele dá o json com erro

    const token = criarToken(usuario._id); //cria o token para o usuário se não cair nos erros acima
    usuario.password = undefined; // oculta a senha para ter segurança

    res.status(200).json({
      status: 'success',
      token,
      informacoes: { usuario }
    });
    
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Mostrar usuarios (GET)
exports.mostrarUsuarios = async (req, res) => {
  try {

    const usuarios = await User.find();// .find() sem nada dentro traz TUDO da coleção

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

// Excluir usuário somente com autorização por token (DELETE protegido)
exports.deletarConta = async (req, res) => {
  try {

    const idUsuario = req.user._id; //vem lá do middleware onde se tudo ocorrer corretamente o usuario atual será o req.ser
    await Comentario.deleteMany({ autor: idUsuario }); //Antes de deletar o usuario, ele entra e deleta todos os comentarios com o autor === à idUsuario
    await User.findByIdAndDelete(idUsuario); //acha e deleta no mongoDB

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

exports.atualizarSenha = async (req, res) => {
  try {

    const { senhaAtual, novaSenha } = req.body; //dados vindos do body

    const usuario = await User.findById(req.user._id).select('+password'); //precisa dar .select('+password') porque a senha no model esta com select = false, por segurança

    const senhaCorreta = await usuario.compararSenha(senhaAtual); //usa o método do model para comparar a senha e ver se esta correta
    
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Sua senha atual está incorreta.' });
    }

    usuario.password = novaSenha; //Se estiver correta, atualizar para a nova senha
    await usuario.save();// .save é usado para salvar e passar pela encriptação do model, que é ativada antes de usar .save

    res.status(200).json({
      status: 'success',
      message: 'Senha atualizada com sucesso!'
    });

  }
  catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.atualizarPerfil = async (req, res) => {
  try {

    const { username, email, bio } = req.body; //define o que pdoe ser mudado ou não
    const camposAtualizados = {};

    if (username) camposAtualizados.username = username;
    if (email) camposAtualizados.email = email;
    if (bio) camposAtualizados.bio = bio;

    //atualiza o usuario logado e autenticado pelo middleware
    const usuario = await User.findByIdAndUpdate(req.user._id, camposAtualizados, {new: true,runValidators: true});
    /*findByIdAndUdate usa 3 parâmetros:
    1 - id para se localizar
    2 - o que quer mudar em forma de objeto
    3 - As especificações, como por exemplo:
    new: faz com que o mongoose envie esse como sendo o comentario atualizado
    runValidators: faz com que as requisições do esquema sejam conferidas (como required)
    */

    res.status(200).json({
      status: 'success',
      data: { user: usuario }
    });

  }
  catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};