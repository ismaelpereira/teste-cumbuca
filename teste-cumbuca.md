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

- [ ] Criar aplicação com Typescript
- [ ] Instalar Express
- [ ] Instalar Sequelize
- [ ] Criar Model do User
- [ ] Criar Controller de CRUD do User
- [ ] Criar rota `post user/register` que cria o usuário no banco com um JWT token
  - [ ] JWTSign
  - [ ] Cria um usuário no banco com o token já criado
  - [ ] Cria middleware de autenticação
- [ ] Criar rota `get user/auth` que retornar a key -[ ] Retorna o id do usuário e o token

### Com autenticação

- [ ] Criar rota `get user/balance/:id` que retorna o saldo do usuário logado
  - [ ] Checa se o Bearer é igual ao token de autenticação.
  - [ ] Envia um JSON com o id do usuário e com o saldo
- [ ] Criar Model de Transaction
- [ ] Cria Controller de CRUD das Transactions
- [ ] Cria pasta Usecases e adiciona uma função para transferir dinheiro
- [ ] Criar rota `post user/send/:id/` com um body com o id do usuário logado e o valor desejado.
  - [ ] Checa se o Bearer é igual ao token de autenticação.
  - [ ] Verifica se o usuário tem saldo suficiente
  - [ ] Cria transação
  - [ ] Transfere o dinheiro
- [ ] Cria rota `post user/reverse/:id/:transactionId` que estorna a transação
  - [ ] Checa se o Bearer é igual ao token de autenticação.
  - [ ] Procura a transação
  - [ ] Verifica se `alreadyReversed` é `false`
  - [ ] Verifica se o usuário que criou a transação
  - [ ] Verifica se ambos os usuários ainda existem
  - [ ] Tira o valor do receiver
  - [ ] Adiciona o valor no sender
  - [ ] Atualiza a `alreadyReversed` para `true`
- [ ] Cria rota `get user/:id/transactions/?startDate=XXXXX&?endDate=XXXXXX` que recebe uma data inicial e uma final, no formato `YYYY-MM-DD` e filtra as transações daquele usuário

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

- Utilizar Query String na requisição da transação

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
