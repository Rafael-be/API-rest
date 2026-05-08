const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true, // Garante que "USUARIO" e "usuario" sejam salvos como "usuario"
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
    select: false // Não retorna a senha nas consultas por padrão
  },
  bio: {
    type: String,
    maxlength: 160,
    default: ""
  }
}, {
  timestamps: true
});

// Middleware do Mongoose: Criptografa a senha antes de salvar o usuário
userSchema.pre('save', async function(next) {
  // Só criptografa se a senha for nova ou estiver sendo modificada
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas (útil no momento do Login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;