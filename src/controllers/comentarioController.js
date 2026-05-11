const Comentario = require('../models/comentarioModel');

const verificarDono = (comentario, idUsuarioAtual) => { //função para verificar se quem esta tentando fazer alguma ação é o dono do próprio comentário
  if (!comentario.autor.equals(idUsuarioAtual)) {
    const erro = new Error('Sem permissão');
    erro.statusCode = 403;
    throw erro;
  }
};

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

    verificarDono(comentario, req.user._id); //verifica se tem permissão de excluir (é o mesmo dono)

    await Comentario.findByIdAndDelete(req.params.id); // Se passou na verificação, deleta

    res.status(200).json({
      status: 'success',
      message: 'Comentário removido com sucesso.'
    });

  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editarComentario = async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;
    const comentarioOriginal = await Comentario.findById(req.params.id); // busca o comentario original

    if (!comentarioOriginal) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    verificarDono(comentarioOriginal, req.user._id);


    const comentarioAtualizado = await Comentario.findByIdAndUpdate(req.params.id, { titulo, conteudo }, { new: true, runValidators: true }); 
    /*findByIdAndUdate usa 3 parâmetros:
    1 - id para se localizar
    2 - o que quer mudar em forma de objeto
    3 - As especificações, como por exemplo:
    new: faz com que o mongoose envie esse como sendo o comentario final, já atualizado
    runValidators: faz com que as requisições do esquema sejam conferidas (como required)
    */

    res.status(200).json({
      status: 'success',
      data: { comentario: comentarioAtualizado }
    });

  }
  catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};