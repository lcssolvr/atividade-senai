const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('tarefas.db')

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tarefas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        concluida BOOLEAN NOT NULL DEFAULT 0,
        prazo TEXT
        )`)
})

module.exports = db