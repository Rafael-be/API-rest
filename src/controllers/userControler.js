const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//O jwt dá um crédito temporário para ter acesso à conta, já o bcrpt criptograda a senha
const createToken = (id) => {// Criar o Token JWT com o id que será passado ao chamar a função
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

    const token = createToken(newUser._id); // '_id' é a chave primária que os objetos ganham no mongoDB

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

    const token = createToken(usuario._id); //cria o token para o usuário se não cair nos erros acima
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

// Excluir usuário (DELETE)
exports.deletarUsuario = async (req, res) => {
  try {
    const id = req.params.id; // Pegamos o ID da URL
    const usuarioDeletado = await User.findByIdAndDelete(id); 

    if (!usuarioDeletado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Usuário excluído com sucesso!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};