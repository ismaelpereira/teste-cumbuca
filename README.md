# Teste Cumbuca - Desafio Back-End

## Interface

A interface do servidor pode ser realizada através do padrão de API de escolha
do candidato (alguns exemplos são os padrões REST, GraphQL e gRPC), desde que se atenha aos
requisitos especificados aqui.

## Funcionalidades

Independentemente da tecnologia escolhida para realizar a API, a interface exposta
deve permitir - de forma clara - realizar as operações descritas abaixo. Recomendamos documentar como realizar as operações no README do seu projeto para facilitar os testes que realizaremos.

### Cadastro de conta

Neste endpoint, devem ser enviados os dados de uma conta e ela deve ser cadastrada na base de contas, caso os dados de usuário estejam válidos de acordo com a seção **Regras de negócio**.

### Autenticação

Neste endpoint, devem ser enviados os dados de login de uma conta já cadastrada.
Esses dados devem ser validados e deve ser retornado um token que será utilizado
para validar transações do usuário. Nos próximos endpoints, o token deve ser
enviado para identificar o usuário logado.

### Cadastro de transação

Neste endpoint, devem ser enviados os dados de uma transação e ela deve ser
cadastrada na base de transações, caso ela seja feita entre contas válidas e
caso haja saldo suficiente na conta do usuário logado para realização dela.

#### Estorno de transação

**ATENÇÃO**: Caso esteja realizando este teste no nível **Júnior** ou **Pleno**, este endpoint é **opcional**.

Neste endpoint, deve ser enviado o ID de uma transação já cadastrada e os efeitos dessa transação devem ser revertidos, caso seja possível e a transação tenha sido iniciada pelo usuário logado.

#### Busca de transações por data

Neste endpoint, devem ser enviadas datas inicial e final.
O endpoint deve retornar todas as transações realizadas pelo usuário logado entre essas datas em ordem cronológica.

#### Visualização de saldo

Neste endpoint, deve ser visualizado o saldo do usuário logado.

## Regras de negócio

1. Não deve ser possível forjar um token de autenticação. Os tokens devem identificar de forma única o usuário logado.
2. Uma transação só deve ser realizada caso haja saldo suficiente na conta do usuário para realizá-la.
3. Após a realização de uma transação, a conta do usuário enviante deve ter seu valor descontado do valor da transação e a do usuário recebedor acrescentada do valor da transação.
4. Todas as transações realizadas devem ser registradas no banco de dados.
5. Caso todas as transações no banco de dados sejam realizadas novamente a partir do estado inicial de todas as contas, os saldos devem equivaler aos saldos expostos na interface. Em outros termos: Para toda conta, se somarmos os valores de todas as transações no histórico dela a qualquer momento, o saldo total da conta deve ser o saldo atual.
6. Uma transação só pode ser estornada uma vez.

## Entidades

As entidades descritas abaixo são especificações do mínimo de dados necessários para as operações do sistema. Podem ser adicionados outros campos conforme o candidato considere necessário.

### Conta de usuário

Uma conta de usuário precisa no mínimo dos seguintes dados para criação:

- Nome e sobrenome do portador
- CPF do portador
- Saldo inicial

Adicionalmente, a conta deve armazenar no mínimo os seguintes dados:

- Identificador único
- Data de criação

### Transação

Uma transação precisa no mínimo dos seguintes dados para criação:

- Identificador da conta enviante
- Identificador da conta recebedora
- Valor

Adicionalmente, o registro deve conter no mínimo os seguintes dados:

- Data de processamento
- Identificador único

# Como executar localmente

## Instalação

Você precisará rodar `npm install` para baixar as dependencias. Também será necessário criar um arquivo .env como o exemplo abaixo

```env
DB_NAME = <Nome do banco de dados>
DB_USER = <Usuário do banco de dados>
DB_HOST = <Host do banco de dados, nesse caso localhost ou 127.0.0.1>
DB_DRIVER = <Qual banco de dado será aceito>
# O Sequeliza aceita Postgres, MYSQL, MariaDB, SQLite e Microsoft SQL Server
DB_PASSWORD = <Senha do banco de dados>

JWT_SECRET = <Private key do JWT>
```

Após esse processo será necessário rodar `npm run start` para iniciar o nodemon.

## Endpoints

### Sem autenticação

`POST /register`

Cadastra o usuário no banco de dados, necessário enviar um JSON como no exemplo abaixo

```json
{
  "fullName": "Jhon Doe",
  "CPF": "123.456.789-10",
  "password": "123password",
  "balance": 1000
}
```

`POST /login`

Faz o login de um usuário e renova o token JWT de um usuário após expirar. É necessário enviar um body com o CPF e a senha do usuário. Exemplo abaixo:

- _O token expira em 2h_

```json
{
  "CPF": "123.456.789-10",
  "password": "123password"
}
```

### Com autenticação

A partir daqui, em todas as rotas é necessário utilizar um Header "authorization". Também é necessário colocar um prefixo "Bearer" antes do token.

`GET /user/:id/balance`

Retorna o saldo em reais do usuário. Para isso o parâmetro `:id` precisa ser o ID de um usuário cadastrado.

`POST /user/:id/transaction`

Realiza uma transação.

Precisa de um parâmetro na query contendo o ID do usuário que irá receber a transação.

- :id => ID do usuário que irá enviar o dinheiro

Parâmetros da query `?receiver=<id do usuário que irá receber>&amount=<valor a ser transferido>`

`POST /user/:id/refound/:transactionId`

Faz um pedido de reembolso em uma transação.

- :id => ID do usuário que enviou o dinheiro
- :transactionId => ID da transação

`GET /user/:id/transactions`

Filtra as transações feitas pelo usuário por data.

Precisa de pelo menos um parâmetro, a data inicial.

Parâmetros da query `?startDate=<Data inicial | Obrigatório>&endDate=<Data Final | Opcional>`

Se a data final não for iniciada, serão filtradas todas as transferências da data inicial até a data de agora.
