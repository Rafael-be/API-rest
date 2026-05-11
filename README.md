Esta é uma API REST completa e segura desenvolvida em Node.js, focada no gerenciamento de usuários e publicações de comentários.
O sistema conta com autenticação por Tokens (JWT), criptografia de senhas, validação de dados e relacionamento entre coleções no banco de dados.
Este projeto foi construído utilizando as seguintes ferramentas e bibliotecas:
 - Node.js & Express.js: Base da aplicação e gerenciamento de rotas.
 - MongoDB & Mongoose: Banco de dados NoSQL e modelagem de dados (Schemas, Models, Hooks de pre-save).
 - Bcrypt.js: Criptografia unidirecional de senhas para segurança do usuário.
 - JSON Web Token (JWT): Geração e verificação de tokens para sessões de usuários.
 - Dotenv: Gerenciamento de variáveis de ambiente.
 - Git: Versionamento de código.
 - Talend API Tester: Ferramentas utilizadas para teste e validação das rotas durante o desenvolvimento.

Funcionalidades Principais:
 - Arquitetura Modular: Separação clara de responsabilidades (Controllers, Models, Rotas e Middlewares).
 - Autenticação e Autorização: Middlewares que garantem que apenas usuários logados acessem certas rotas e que apenas os donos dos comentários possam editá-los ou excluí-los.
 - CRUD de Usuários: Atualização de perfil, troca segura de senha (com re-autenticação) e exclusão de conta.
 - CRUD de Comentários: Criação, listagem limpa (sem exposição de versão __v), edição e exclusão.
 - Integridade Referencial (Exclusão em Cascata): Se um usuário deleta sua conta, todos os seus comentários são automaticamente removidos do banco.
 
 Estrutura do Projeto:
 O código está organizado seguindo as melhores práticas para facilitar a manutenção e escalabilidade:
 - .env para variáveis de ambiente (não vai para o GitHub)
 - .gitignore para arquivos ignorados pelo Git
 - package.json para dependências do projeto
 - app.js - ponto de entrada (Configuração do Express e montagem das rotas)
 - src:


│   - controllers/ - Lógica de negócio (userController.js, comentarioController.js)


│   - middlewares/ - Funções de interceptação (autenticacaoMiddleware.js)


│   - models/ - Schemas do banco de dados (userModel.js, comentarioModel.js)


│   - routes/ - Definição dos Endpoints (userRoutes.js, comentarioRoutes.js)

Passo a Passo de como Rodar a Aplicação:
1. Pré-requisitosCertifique-se de ter instalado em sua máquina:
 - Node.js (Versão LTS recomendada)
 - Git
 - Uma conta no MongoDB e MongoCompass
2. Clonando o Repositório e Versionamento
Este projeto utiliza Git para versionamento de código. Para baixar e inicializar:
Clone o repositório com o bash:
git clone https://github.com/Rafael-be/API-rest

Entre na pasta do projeto com o bash:
cd API-rest

3. Instalando as Dependências
 - Execute o comando abaixo para baixar as pastas node_modules:
 npm install
4. Configurando as Variáveis de Ambiente (.env)
Na raiz do projeto, crie um arquivo chamado .env e adicione as seguintes variáveis:
 - PORT=3000
 - MONGODB_URI=mongodb://localhost:27017/API-REST
 - JWT_SECRET=senha_secreta123@

5. Iniciando o Servidor para rodar a aplicação em ambiente de desenvolvimento:
node app.js

Você verá a mensagem: Servidor rodando na porta 3000! e a confirmação de conexão com o banco de dados.

6. Rotas para teste de funcionalidades
No talend, faça as seguintes coisas para ter a experiência de usuário completa:

Passo 1: Cadastro de Usuário
Comece criando seu primeiro usuário. É recomendado criar pelo menos dois usuários para testar as travas de segurança de edição de comentários alheios.
 - Método: POST
 - URL: http://localhost:3000/api/users/cadastro

Body (JSON):

{
  "username": "seu_nome",
  "email": "exemplo@endereco.com",
  "password": "senha_segura",
  "bio": "Bio"
}


(Se quiser criar outra conta para ter melhor visão das próximas features, é recomendado)


Passo 2: Login e Autenticação
Faça login para gerar seu token de acesso. Sem ele, você não conseguirá acessar as rotas protegidas.
 - Método: POST
 - URL: http://localhost:3000/api/users/login

Body (JSON):

{
  "email": "exemplo@endereco.com",
  "password": "senha_segura"
}


IMPORTANTE: Copie o token gerado na resposta. No Talend, em todas as rotas abaixo, vá na aba Headers, adicione "Authorization" no nome e "Bearer (valor do TOKEN)" no valor.


Passo 3: Mostrar todos os Usuários
Veja a lista de todos os usuários cadastrados no sistema.
 - Método: GET
 - URL: http://localhost:3000/api/users/mostrar


Passo 4: Criar um Comentário
Agora que está autenticado, publique algo no sistema.
 - Método: POST
 - URL: http://localhost:3000/api/comentarios/criar

Body (JSON):

{
  "titulo": "Titulo 1",
  "conteudo": "Primeiro comentário"
}


Passo 5: Mostrar todos os Comentários
Visualize todos os comentários publicados por todos os usuários.
 - Método: GET
 - URL: http://localhost:3000/api/comentarios/mostrar


Passo 6: Editar seu Comentário
Atualize o título ou conteúdo de um comentário criado por você.
 - Método: PATCH
 - URL: http://localhost:3000/api/comentarios/editar/ID_DO_COMENTARIO

Body (JSON):

{
  "titulo": "Titulo Atualizado",
  "conteudo": "Conteúdo modificado"
}


Passo 7: Atualizar Perfil e Senha
Gerencie seus dados de conta.
Perfil: PATCH em http://localhost:3000/api/users/atualizar-perfil 

Body: 

{
 "username": "",
 "email": "",
 "bio": ""
 }

Senha: PATCH em http://localhost:3000/api/users/atualizar-senha 

Body: 

{
 "senhaAtual": "",
 "novaSenha": ""
 }


Passo 8: Exclusão (Cascata)
Teste a remoção de dados.

Deletar Comentário: DELETE em http://localhost:3000/api/comentarios/deletar/ID_DO_COMENTARIO

Deletar Conta: DELETE em http://localhost:3000/api/users/deletar-conta 

(Isso removerá automaticamente todos os comentários do usuário).