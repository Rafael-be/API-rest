const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Valida o token JWT enviado no header Authorization e autentica a requisição.
 *
 * Espera o formato `Authorization: Bearer <token>`. Quando o token é válido e o
 * usuário ainda existe no banco, adiciona o documento do usuário em `req.user`
 * para que os próximos middlewares/controllers possam aplicar regras de permissão.
 *
 * @param {Request} req Requisição HTTP.
 * @param {Response} res Resposta HTTP.
 * @param {NextFunction} next Próximo middleware da cadeia.
 * @returns {Promise<void>}
 */
exports.verificarToken = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Você não está logado!' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioAtual = await User.findById(decoded.id);
    
    if (!usuarioAtual) {
      return res.status(401).json({ message: 'O usuário deste token não existe' });
    }

    req.user = usuarioAtual;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
