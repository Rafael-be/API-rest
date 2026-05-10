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

exports.deletarComentario = async (req, res) => {
  try {

    const comentario = await Comentario.findById(req.params.id); //pega o id do comentário pela URL para excluir

    if (!comentario) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }


    if (!comentario.autor.equals(req.user._id)) { //compara quem esta logado com o token através do middleware e checa se é o mesmo autor do comentário
      return res.status(403).json({ 
        message: 'Você não tem permissão para deletar o comentário de outra pessoa' 
      });
    }

    // 3. Se passou na verificação, deleta
    await Comentario.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Comentário removido com sucesso.'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
