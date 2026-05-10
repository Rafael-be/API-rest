const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.proteger = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {// Se o token veio do header e com o 'bearer' no início ele vai alocar algo à variável token. Ex de header:(Authorization: Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1]; //separa o 'Bearer TOKEN' em um array que nem no C para guardar strings ["Bearer", "TOKEN"]
    }

    if (!token) {
      return res.status(401).json({ message: 'Você não está logado!' }); //Se não tem token retorna 401 (sem permissão)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // pergunta pro JWT qual id o token com tal chave gera. Dentro desse token tem uma chave de expiração gravada pelo método criarToken e se estiver expirado ele da erro e cai no catch
    const usuarioAtual = await User.findById(decoded.id); //procura o usuario com o id gerado pelo jwt.verify. O verify gera um objeto com várias propriedades e para buscar o id uas o .id ao final
    
    if (!usuarioAtual) {
      return res.status(401).json({ message: 'O usuário deste token não existe mais.' });
    }

    req.user = usuarioAtual; // Aqui o usuário logado fica disponível para a próxima função
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};