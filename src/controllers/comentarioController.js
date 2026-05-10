const Comentario = require('../models/comentarioModel');

exports.criarComentario = async (req, res) => {
  try {

    const novoComentario = await Comentario.create({ // Pega o título e conteudo do body e o autor pelo Middleware de autenticação
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      autor: req.user._id, // O ID do usuário que é passado pelo Middleware
      nomeAutor: req.user.username
    });

    res.status(201).json({
      status: 'success',
      informacoes: { comentario: novoComentario }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.verComentarios = async (req, res) => {
    try {
    
        const comentarios = await Comentario.find().select('-__v'); // __v é uma propriedade do banco que eu quero que não seja mostrada, o select diz o que você não quer mostrar ou só quer mostrar

        res.status(200).json({
        status: 'success',
        resultados: comentarios.length,
        informacoes: { comentarios }
        });
    }
    catch (err) {
        res.status(500).json({ 
        status: 'error', 
        message: err.message 
        });
    }
};

