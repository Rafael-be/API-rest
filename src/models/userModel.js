const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'O username deve ter pelo menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, use um e-mail válido']
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
    select: false // Evita que a senha seja retornada em consultas GET comuns por segurança
  },
  bio: {
    type: String,
    maxlength: [160, 'A bio pode ter no máximo 160 caracteres'],
    default: ""
  },
  profilePicture: {
    type: String,
    default: "https://via.placeholder.com/150"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Cria automaticamente os campos 'createdAt' e 'updatedAt'
});

const User = mongoose.model('User', userSchema);

module.exports = User;