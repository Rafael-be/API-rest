const mongoose = require('mongoose');

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
    type: mongoose.Schema.Types.ObjectId, // Guardam o ID do usuário
    ref: 'User', // Nome do Model criado para o usuario
    required: [true, 'ID não encontrado']
  },
  nomeAutor: {
    type: String,
    required: [true, 'Nome do autor não encontrado']
  }
}, { timestamps: true });

module.exports = mongoose.model('Comentario', comentarioSchema);