const Comentario = require('../models/comentarioModel');

/**
 * Verifica se o usuário autenticado é o autor do comentário.
 *
 * @param {Object} comentario Comentário encontrado no banco.
 * @param {ObjectId|string} idUsuarioAtual Id do usuário autenticado.
 * @throws {Error} Lança erro com `statusCode` 403 quando o usuário não é o autor.
 * @returns {void}
 */
const verificarDono = (comentario, idUsuarioAtual) => {
  if (!comentario.autor.equals(idUsuarioAtual)) {
    const erro = new Error('Sem permissão');
    erro.statusCode = 403;
    throw erro;
  }
};

/**
 * Cria um comentário vinculado ao usuário autenticado.
 *
 * Depende do middleware de autenticação para preencher `req.user` com `_id` e `username`.
 *
 * @param {Request} req Requisição autenticada com `titulo` e `conteudo` no body.
 * @param {Response} res Resposta HTTP com o comentário criado.
 * @returns {Promise<void>}
 */
exports.criarComentario = async (req, res) => {
  try {

    const novoComentario = await Comentario.create({
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      autor: req.user._id,
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

/**
 * Lista todos os comentários publicados.
 *
 * Remove o campo interno `__v` da resposta.
 *
 * @param {Request} req Requisição HTTP.
 * @param {Response} res Resposta HTTP com a lista de comentários.
 * @returns {Promise<void>}
 */
exports.verComentarios = async (req, res) => {
    try {
    
        const comentarios = await Comentario.find().select('-__v');

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

/**
 * Remove um comentário quando o usuário autenticado é o autor.
 *
 * @param {Request} req Requisição autenticada com `id` do comentário em `params`.
 * @param {Response} res Resposta HTTP com confirmação da exclusão.
 * @returns {Promise<void>}
 */
exports.deletarComentario = async (req, res) => {
  try {

    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    verificarDono(comentario, req.user._id);

    await Comentario.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Comentário removido com sucesso.'
    });

  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Atualiza um comentário quando o usuário autenticado é o autor.
 *
 * @param {Request} req Requisição autenticada com `id` em `params` e `titulo`/`conteudo` no body.
 * @param {Response} res Resposta HTTP com o comentário atualizado.
 * @returns {Promise<void>}
 */
exports.editarComentario = async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;
    const comentarioOriginal = await Comentario.findById(req.params.id);

    if (!comentarioOriginal) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    verificarDono(comentarioOriginal, req.user._id);


    const comentarioAtualizado = await Comentario.findByIdAndUpdate(req.params.id, { titulo, conteudo }, { new: true, runValidators: true }); 

    res.status(200).json({
      status: 'success',
      data: { comentario: comentarioAtualizado }
    });

  }
  catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
