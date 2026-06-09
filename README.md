# API REST com Node.js, Express e MongoDB

![Node.js](https://img.shields.io/badge/Node.js-API-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

API REST desenvolvida em Node.js para gerenciamento de usuários e publicações de comentários.
O projeto implementa autenticação com JWT, criptografia de senhas, validações com Mongoose e controle de permissão para que apenas o autor possa editar ou excluir seus próprios comentários.

## Sumário

- [Stack tecnológica](#stack-tecnológica)
- [Funcionalidades](#funcionalidades)
- [Demonstração e documentação](#demonstração-e-documentação)
- [Documentação interna](#documentação-interna)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rotas da API](#rotas-da-api)
- [Fluxo recomendado de teste](#fluxo-recomendado-de-teste)

## Stack tecnológica

- **Node.js**: ambiente de execução JavaScript.
- **Express.js**: criação do servidor HTTP e gerenciamento das rotas.
- **MongoDB**: banco de dados NoSQL usado para persistência.
- **Mongoose**: modelagem dos dados, validações, schemas e hooks.
- **Bcrypt.js**: criptografia das senhas antes de salvar no banco.
- **JSON Web Token (JWT)**: autenticação e proteção de rotas privadas.
- **Dotenv**: carregamento de variáveis de ambiente.
- **Swagger UI + swagger-jsdoc**: documentação interativa da API.
- **Git**: versionamento do código.

## Funcionalidades

- Cadastro de usuários com senha criptografada.
- Login com geração de token JWT.
- Listagem de usuários cadastrados.
- Atualização de perfil do usuário autenticado.
- Troca segura de senha com confirmação da senha atual.
- Exclusão da própria conta.
- Remoção em cascata dos comentários ao excluir uma conta.
- Criação de comentários vinculados ao usuário autenticado.
- Listagem pública de comentários.
- Edição de comentários apenas pelo autor.
- Exclusão de comentários apenas pelo autor.
- Validação de dados com Mongoose.
- Documentação interativa com Swagger.
- Documentação interna com JSDoc em models, controllers e middlewares.

## Demonstração e documentação

Com o servidor em execução, acesse a documentação interativa:

```text
http://localhost:3000/api-docs
```

Nessa página é possível visualizar os endpoints, os corpos esperados das requisições e testar a API diretamente pelo navegador.

## Documentação interna

O projeto também possui documentação interna em JSDoc nos principais pontos da aplicação:

- `src/models`: descreve schemas, validações, hooks do Mongoose e métodos de instância.
- `src/controllers`: documenta os handlers HTTP, os dados esperados no `body`/`params` e os retornos.
- `src/middlewares`: documenta o fluxo de autenticação JWT e o preenchimento de `req.user`.

As rotas continuam documentadas com blocos `@swagger`, usados pelo `swagger-jsdoc` para montar a página interativa em `/api-docs`.

Caso queira gerar uma documentação estática a partir dos comentários JSDoc, rode:

```bash
npx jsdoc src/models src/controllers src/middlewares -d docs/jsdoc
```

## Estrutura do projeto

```text
.
+-- app.js
+-- package.json
+-- package-lock.json
+-- README.md
`-- src
    +-- controllers
    |   +-- comentarioController.js
    |   `-- userControler.js
    +-- middlewares
    |   `-- autenticacaoMiddleware.js
    +-- models
    |   +-- comentarioModel.js
    |   `-- userModel.js
    +-- routes
    |   +-- comentarioRoutes.js
    |   `-- userRoutes.js
    `-- swagger
        `-- swagger.js
```

## Pré-requisitos

Antes de começar, tenha instalado:

- [Node.js](https://nodejs.org/) em versão LTS.
- [Git](https://git-scm.com/).
- Uma instância do MongoDB, local ou em nuvem.
- Opcional: MongoDB Compass, Postman, Insomnia ou Talend API Tester para testar as rotas.

## Como rodar o projeto

Clone o repositório:

```bash
git clone https://github.com/Rafael-be/API-rest.git
```

Entre na pasta do projeto:

```bash
cd API-rest
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente conforme o exemplo da próxima seção.

Inicie a aplicação:

```bash
node app.js
```

Se tudo estiver configurado corretamente, o terminal exibirá mensagens parecidas com:

```text
CONECTADO ao banco de dados
Servidor rodando na porta 3000
```

## Variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/API-REST
JWT_SECRET=sua_chave_secreta
```

Descrição das variáveis:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | Não | Porta em que o servidor será iniciado. Caso não seja informada, a API usa `3000`. |
| `MONGODB_URI` | Sim | String de conexão com o MongoDB. |
| `JWT_SECRET` | Sim | Chave usada para assinar e validar os tokens JWT. |

> Nunca envie o arquivo `.env` para repositórios públicos. Use valores fortes e diferentes em produção.

## Rotas da API

### Usuários

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/api/users/cadastro` | Não | Cadastra um novo usuário. |
| `POST` | `/api/users/login` | Não | Autentica o usuário e retorna um token JWT. |
| `GET` | `/api/users/mostrar` | Não | Lista os usuários cadastrados. |
| `PATCH` | `/api/users/atualizar-perfil` | Sim | Atualiza `username`, `email` e/ou `bio`. |
| `PATCH` | `/api/users/atualizar-senha` | Sim | Altera a senha após confirmar a senha atual. |
| `DELETE` | `/api/users/deletar-conta` | Sim | Exclui a conta autenticada e seus comentários. |

### Comentários

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/api/comentarios/criar` | Sim | Cria um comentário para o usuário autenticado. |
| `GET` | `/api/comentarios/mostrar` | Não | Lista todos os comentários. |
| `PATCH` | `/api/comentarios/editar/:id` | Sim | Edita um comentário, desde que o usuário seja o autor. |
| `DELETE` | `/api/comentarios/deletar/:id` | Sim | Remove um comentário, desde que o usuário seja o autor. |

Para acessar rotas protegidas, envie o token JWT no header:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

## Fluxo recomendado de teste

### 1. Cadastrar usuário

```http
POST /api/users/cadastro
Content-Type: application/json
```

```json
{
  "username": "rafael",
  "email": "rafael@email.com",
  "password": "senha_segura",
  "bio": "Desenvolvedor backend"
}
```

### 2. Fazer login

```http
POST /api/users/login
Content-Type: application/json
```

```json
{
  "email": "rafael@email.com",
  "password": "senha_segura"
}
```

Copie o token retornado e utilize-o nas próximas rotas protegidas.

### 3. Criar comentário

```http
POST /api/comentarios/criar
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

```json
{
  "titulo": "Primeiro comentário",
  "conteudo": "Esse é o conteúdo do meu primeiro comentário."
}
```

### 4. Listar comentários

```http
GET /api/comentarios/mostrar
```

### 5. Editar comentário

```http
PATCH /api/comentarios/editar/ID_DO_COMENTARIO
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

```json
{
  "titulo": "Comentário atualizado",
  "conteudo": "Conteúdo atualizado com sucesso."
}
```

### 6. Atualizar perfil

```http
PATCH /api/users/atualizar-perfil
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

```json
{
  "username": "rafael_backend",
  "email": "novo-email@email.com",
  "bio": "Estudando Node.js, Express e MongoDB"
}
```

### 7. Atualizar senha

```http
PATCH /api/users/atualizar-senha
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

```json
{
  "senhaAtual": "senha_segura",
  "novaSenha": "nova_senha_segura"
}
```

### 8. Excluir comentário

```http
DELETE /api/comentarios/deletar/ID_DO_COMENTARIO
Authorization: Bearer SEU_TOKEN_AQUI
```

### 9. Excluir conta

```http
DELETE /api/users/deletar-conta
Authorization: Bearer SEU_TOKEN_AQUI
```

Ao excluir a conta, todos os comentários vinculados ao usuário também são removidos.

## Observações importantes

- Crie pelo menos dois usuários para testar a regra que impede editar ou excluir comentários de outra pessoa.
- A senha nunca é retornada nas consultas de usuário.
- O token JWT expira em `1d`, conforme definido no controller de usuários.
- A documentação do Swagger é gerada a partir dos comentários presentes nos arquivos de rotas.
- A documentação interna em JSDoc fica nos models, controllers e middlewares para apoiar manutenção e evolução do código.
