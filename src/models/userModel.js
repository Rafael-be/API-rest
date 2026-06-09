const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //dependência para criptografar

/**
 * Schema do usuário da API.
 *
 * Regras principais:
 * - `username` e `email` são únicos, normalizados em lowercase e sem espaços extras.
 * - `password` não é retornado por padrão nas consultas por usar `select: false`.
 * - `bio` é opcional e limitada a 160 caracteres.
 *
 * @type {mongoose.Schema}
 */
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
    select: false
  },
  bio: {
    type: String,
    maxlength: 160,
    default: ""
  }
}, {
  timestamps: true
});

/**
 * Criptografa a senha antes de salvar o usuário.
 *
 * O hook é executado em criações e em alterações feitas com `.save()`.
 * Quando a senha não foi modificada, o hash anterior é preservado.
 *
 * @param {Function} next Callback do middleware do Mongoose.
 * @returns {Promise<void>}
 */
userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

/**
 * Compara uma senha em texto puro com o hash armazenado no usuário.
 *
 * @param {string} senhaDigitada Senha informada pelo usuário no login ou na troca de senha.
 * @returns {Promise<boolean>} `true` quando a senha informada corresponde ao hash salvo.
 */
userSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.password);
};

/**
 * Model Mongoose responsável pela coleção de usuários.
 *
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
