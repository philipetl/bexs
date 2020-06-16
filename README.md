# BEXS - processo de entrevista

## Como executar a aplicação
Dentro da raiz do projeto, execute a instalação das dependências do node:
```sh
$ npm install
```
Então, ainda na raiz ou utilizando navegação de diretórios por referência, execute o comando:
```sh
$ node start <ARQUIVO>
```
O ARQUIVO é opcional. Caso não passe o caminho no parâmetro, a aplicação assumirá `./src/resouce/input-file.csv` e utilizará o arquivo fornecido na descrição do problema.

## Estrutura dos arquivos
```
|	.gitignore
|	index.js
|	jest.config.js
|	package-lock.json
|	package.json
|	tree.txt
|___src
|	|	app.js
|	|___config
|	|		CustomExpress.js
|	|___controller
|	|		Controller.js
|	|___domain
|	|		Route.js
|	|___helper
|	|		RouteFile.js
|	|		Validator.js
|	|___manager
|	|		Manager.js
|	|___resource
|	|		input-file.csv
|	|___service
|			 Searcher.js
|___tests
	|	route.test.js
	|___mocks
	|		routeMock.js
	|___resource
		invalid-input.csv
		valid-input.csv
```

## Escolha do Node
Confesso que apesar de não tão familiarizado com o Node, utilizei como forma de aprender e também para facilitar a integração entre a linha de comando e com as respostas às requisições REST, além de uma forma fácil e rápida de levantar uma aplicação.

## Descrição simplificada da API Rest
```
[GET] localhost:3000/route?queryRoute=GRU-CDG
Responses:
[HTTP/1.1 200 OK]                       best route: GRU - BRC - SCL - ORL - CDG > $40
[HTTP/1.1 400 BAD REQUEST]              invalid search
[HTTP/1.1 500 INTERNAL SERVER ERROR]    others

[POST] localhost:3000/route
body: { "route": "GGG,PPP,679" }
[HTTP/1.1 201 OK]                       route added
[HTTP/1.1 400 BAD REQUEST]              route already exists
[HTTP/1.1 500 INTERNAL SERVER ERROR]    others
```
