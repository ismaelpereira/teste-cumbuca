# Cumbuca App

```
npm init

npm i express

npm i typescript ts-node @types/express @types/node nodemon
```

Ir para o `package.json` e adicionar o script

```
start: npx tsc-init && node index.js
```

E por último

```
npm i nodemon -D
```

## O que vou usar

- Typescript
- JWT
- Express

## Schemas

- ### User

  - id
  - fullName
  - cpf
  - balance
  - token
  - createdAt

- ### Transaction
  - id
  - senderId
  - receiverId
  - value
  - createdAt
  - alreadyReversed

## Funcionalidades

- Cadastrar uma conta
- Realizar transação
- Estornar transação
- Ver saldo
- Buscar transações por data

## Etapas

### Sem autenticação

- [x] Criar aplicação com Typescript
- [x] Instalar Express
- [x] Instalar Sequelize
- [x] Fazer conexão com o banco de dados
- [x] Criar Model do User
- [x] Criar Controller de CRUD do User
- [x] Criar rota `post user/register` que cria o usuário no banco com um JWT token
  - [x] JWTSign
  - [x] Cria um usuário no banco com o token já criado
  - [x] Cria middleware de autenticação
- [x] Criar rota de login
  - [x] Rota `/login`
  - [x] Retorna o CPF, Senha e token

### Com autenticação

- [x] Criar rota `get user/balance/:id` que retorna o saldo do usuário logado
  - [x] Envia um JSON com o id do usuário e saldo com o saldo
- [x] Criar Model de Transaction
- [x] Cria Controller de CRUD das Transactions
- [x] Cria pasta Usecases e adiciona uma função para transferir e estornar
- [x] Criar rota `post user/transfer/:id/?receiver=XXXXXXXX&?amount=XXXX` com o id do usuário logado, usuário que vai receber e o valor desejado.
  - [x] Verifica se o usuário tem saldo suficiente
  - [x] Cria transação
  - [x] Transfere o dinheiro
- [x] Cria rota `post user/refound/:id/:transactionId` que estorna a transação
  - [x] Procura a transação
  - [x] Verifica se `alreadyRefounded` é `false`
  - [x] Verifica se ambos os usuários ainda existem
  - [x] Tira o valor do receiver
  - [x] Adiciona o valor no sender
  - [x] Atualiza a `alreadyRefounded` para `true`
- [ ] Cria rota `get user/:id/transactions/?startDate=XXXXX&?endDate=XXXXXX` que recebe uma data inicial e uma final, no formato `YYYY-MM-DD` e filtra as transações daquele usuário

  - [ ] Cria dal `filterTransactionsByDate`
  - [ ] Implementa a rota

  ```js
    Transactions.findAll({
        where:{
            senderId: //id do usuário autenticado,
            createdAt: {
                [Op.between]: [startDate,endDate]
            }
        }
    })

  ```

## Observações

- Utilizar Query String nas requisições da transação

```js
//get query&params in express

//etc. example.com/user/000000?sex=female

app.get("/user/:id", function (req, res) {
  const query = req.query; // query = {sex:"female"}

  const params = req.params; //params = {id:"000000"}
});
```

- O formato da Data da query string deve ser YYYY-MM-DD

- Ler os dados do Sequelize com dotenv

## Links Úteis

- [JWT](https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/)

- [JWT Project](https://github.com/Olanetsoft/jwt-project)

- [Sequelize Operators](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)

- [Sequelize Project](https://github.com/ibywaks/cookbook)

## Estrutura do projeto

- src
  - db
    - dal
      - User.ts
      - Transaction.ts
    - model
      - User.ts
      - Transaction.ts
  - api
    - routes
      - router.ts
      - users.ts
    - usecases
      - CreateNewTransaction.ts
  - middleware
    - auth.ts
    - index.ts
