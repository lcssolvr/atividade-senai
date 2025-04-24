
# Atividade SENAI

API de Tarefas do tipo TO-DO

## Configuração do Projeto para VS Code

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [VS Code](https://code.visualstudio.com/download)

### Como executar o projeto

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd atividade-senai
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
node app.js
```

4. Abra o navegador em [http://127.0.0.1:3000](http://127.0.0.1:3000/)


## Tecnologias utilizadas

- Node
- Express
- SQLite


## Requisições HTTP

- GET: http://127.0.0.1:3000/tarefas (ordenar crescente / decrescente: http://127.0.0.1:3000/tarefas?ordenar=asc // http://127.0.0.1:3000/tarefas?ordenar=desc)
- POST: http://127.0.0.1:3000/tarefas (passar titulo, descricao e prazo no POSTMAN ou Insomnia)
- PUT: http://127.0.0.1:3000/tarefas/:id (passar id como parâmetro e depois passar titulo, descricao ou prazo no POSTMAN ou Insomnia para atualizar)
- PATCH: http://127.0.0.1:3000/tarefas/:id/concluir (passar id como parâmetro para concluir tarefa)
- DELETE: http://127.0.0.1:3000/tarefas/:id (passar id como parâmetro para deletar uma tarefa)
