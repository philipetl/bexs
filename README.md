# BEXS - processo de entrevista

## Como executar a aplicação
Dentro da raiz do projeto, execute a instalação das dependências do node:
```sh
$ npm install
```
Então, ainda na raiz ou utilizando navegação de diretórios por referência, execute o comando: `$ npm start <ARQUIVO>`
```sh
$ npm start

> bexs@1.0.0 start C:\Users\cin_plima\workspace\bexs
> node index.js

source file: C:\Users\cin_plima\workspace\bexs\src\resource\input-file.csv
please enter the route: 
```
Exemplo:
```
$ npm start ~/Downloads/arquivo-teste.csv

> bexs@1.0.0 start C:\Users\cin_plima\workspace\bexs
> node index.js "C:/Users/cin_plima/Downloads/arquivo-teste.csv"

source file: C:\Users\cin_plima\Downloads\arquivo-teste.csv
please enter the route:  
```

O ARQUIVO é opcional. Caso não passe o caminho no parâmetro, a aplicação assumirá `./src/resouce/input-file.csv` e utilizará o arquivo fornecido na descrição do problema.

Ao iniciar, a aplicação exibirá o arquivo que está sendo utilizado e habilitará tanto possibilidade de chamadas via REST quanto input via linha de comando.
```sh
source file: C:\Users\cin_plima\workspace\bexs\src\resource\input-file.csv
please enter the route: ORL-SCL
no routes
please enter the route: SCL-ORL
best route: SCL - ORL > $20
please enter the route: bla-bla
invalid search
please enter the route:
```


## Estrutura dos arquivos
```
|	.gitignore
|	index.js
|	jest.config.js
|	package-lock.json
|	package.json
|	tree.txt
|___documentation/*
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
[HTTP/1.1 404 NOT FOUND]                no routes
[HTTP/1.1 500 INTERNAL SERVER ERROR]    others

[POST] localhost:3000/route
body: { "route": "GGG,PPP,679" }
[HTTP/1.1 201 OK]                       route added
[HTTP/1.1 409 CONFLICT]		            route already exists
[HTTP/1.1 500 INTERNAL SERVER ERROR]    others
```

## Documentação
A documentação está disponível em `./documentation/index.html` na raíz do projeto.