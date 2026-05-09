const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //dependência para criptogradar

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome de usuário é obrigatório'],
    unique: true, //Nao pode ter o mesmo nome, tem que ser diferente
    trim: true, //remove espaços extras no início ou no fim
    lowercase: true, // Nomes serão salvos independentemente de serem "USUARIO" ou "usuario"
    minlength: [3, 'O username deve ter pelo menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, use um e-mail válido'] //TEM que ter algo@endereço.extensão
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
    select: false // Não retorna a senha na URL na busca GET
  },
  bio: {
    type: String,
    maxlength: 160,
    default: "" //Começa com uma String vazia e é opcional
  }
}, {
  timestamps: true //arquiva a data de criação e última alteração
});

// Criptografa a senha antes de salvar o usuário
userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return next();// Só criptografa se a senha for nova ou estiver sendo modificada

  const salt = await bcrypt.genSalt(10); //Caso tenha senhas iguais de usuários diferentes, gera uma aleatoreidade para terem hashes diferentes
  this.password = await bcrypt.hash(this.password, salt); //Encripta a senha
  next();
});

// Comparar senhas:
userSchema.methods.comparePassword = async function(typedPassword) {
  return await bcrypt.compare(typedPassword, this.password); //função que vai ser chamada no controller, usando a senha digitada no placeholder e comparando com a senha criptografada
};

const User = mongoose.model('User', userSchema);

module.exports = User;