const mongoose = require('mongoose');

/**
 * Schema de comentários publicados por usuários autenticados.
 *
 * Cada comentário guarda a referência do autor em `autor` e uma cópia do nome em
 * `nomeAutor`, facilitando a listagem pública sem precisar popular o usuário.
 *
 * @type {mongoose.Schema}
 */
const comentarioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O comentário tem que ter título'],
    trim: true
  },
  conteudo: {
    type: String,
    required: [true, 'O comentário não pode estar vazio'],
    trim: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID não encontrado']
  },
  nomeAutor: {
    type: String,
    required: [true, 'Nome do autor não encontrado']
  }
}, { timestamps: true });

/**
 * Model Mongoose responsável pela coleção de comentários.
 *
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('Comentario', comentarioSchema);
