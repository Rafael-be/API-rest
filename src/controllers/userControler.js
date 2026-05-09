const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


const createToken = (id) => {// Criar o Token JWT com o id que será passado ao chamar a função
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'});
  /*retorna a função jwt.sign, que serve para tfabricar o token
  Ela tem 3 parâmetros:
  1- O que você quer gerar o token, por exemplo quero gerar um token com o id tal que foi passado. O id é um objeto, por isso as {}
  2- A chave de encriptação que esta no .env
  3- Validade do token. '1d' = 1 dia. Também é um objeto, por isso o {}*/
};

// Cadastro (POST)
exports.register = async (req, res) => {
  try {
    
    const { username, email, password, bio } = req.body;
    const newUser = await User.create({ username, email, password, bio });
    
    // Oculta a senha no objeto de resposta por segurança
    newUser.password = undefined;

    const token = createToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: newUser }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message // Exibe erros de duplicidade ou validação do Mongoose
    });
  }
};

// --- LOGIN (POST) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Verifica se e-mail e senha foram enviados
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, informe e-mail e senha' });
    }

    // 2) Busca o usuário e pede explicitamente a senha (que está com select: false)
    const user = await User.findOne({ email }).select('+password');

    // 3) Verifica se usuário existe e se a senha bate (usando o método do Model)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }

    // 4) Se tudo ok, envia o token
    const token = createToken(user._id);
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};