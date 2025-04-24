const PORT = 3000
const express = require('express')
const db = require('./db.js')
const app = express()

app.use(express.json())

app.get('/tarefas', (req, res) => {
    const { ordenar } = req.query
    let query = 'SELECT * FROM tarefas'
    
    if (ordenar === 'asc') {
        query += ' ORDER BY prazo ASC'
    } else if (ordenar === 'desc') {
        query += ' ORDER BY prazo DESC'
    }
    
    db.all(query, (err, rows) => {
        if(err) {
            return res.status(500).json({erro: err.message})
        }
        res.json(rows)
    })
})

app.get('/tarefas/:id', (req, res) => {
    const {id} = req.params
    db.get('SELECT * FROM tarefas WHERE id = ?', [id], (err, tarefa) => {
        if(err) {
            return res.status(500).json({erro: err.message})
        }
        if(!tarefa) {
            return res.status(404).json({erro: "Dados não localizados"})
        }
        res.json(tarefa)
    })
})

app.get('/tarefas/pendentes', (req, res) => {
    db.all('SELECT * FROM tarefas WHERE concluida = 0', (err, rows) => {
        if(err) {
            return res.status(500).json({erro: err.message})
        }
        res.json(rows)
    }) 
})

app.get('/tarefas/vencidas', (req, res) => {
    const dataAtual = new Date().toISOString().split('T'[0])

    db.all('SELECT * FROM tarefas WHERE concluida = 0 AND prazo < ?', [dataAtual], (err, rows) => {
        if(err) {
            return res.status(500).json({èrro: err.message})
        }
        res.json(rows)
    })
})

app.post('/tarefas', (req, res) => {
    const {titulo, descricao, prazo} = req.body

    if(!titulo || !descricao) {
        return res.status(400).json({erro: "Dados incompletos"})
    }

    if(prazo && !isValidDateFormat(prazo)) {
        return res.status(400).json({erro: "Formato do prazo deve ser: ANO-MES-DIA"})
    }

    db.run(`INSERT INTO tarefas (titulo, descricao, concluida, prazo) VALUES (?, ?, 0, ?)`,
        [titulo, descricao, prazo || null],
        function(err) {
            if(err) {
                return res.status(500).json({erro: err.message})
            }
            res.status(201).json({id: this.lastID, titulo: titulo, descricao: descricao, concluida: false, prazo: prazo || null})
        }
    )
})

app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params
    const { titulo, descricao, concluida, prazo } = req.body

    if (prazo && !isValidDateFormat(prazo)) {
        return res.status(400).json({erro: "O prazo deve estar no formato YYYY-MM-DD"})
    }

    db.get('SELECT * FROM tarefas WHERE id = ?', [id], (err, tarefa) => {
        if(err) {
            return res.status(500).json({erro: err.message})
        }
        if(!tarefa) {
            return res.status(404).json({erro: "Tarefa não encontrada"})
        }

        const novoTitulo = titulo || tarefa.titulo
        const novaDescricao = descricao !== undefined ? descricao : tarefa.descricao
        const novoConcluida = concluida !== undefined ? concluida : tarefa.concluida
        const novoPrazo = prazo !== undefined ? prazo : tarefa.prazo

        db.run('UPDATE tarefas SET titulo = ?, descricao = ?, concluida = ?, prazo = ? WHERE id = ?', 
            [novoTitulo, novaDescricao, novoConcluida ? 1 : 0, novoPrazo, id], 
            function(err) {
                if(err) {
                    return res.status(500).json({erro: err.message})
                }
                res.json({id: parseInt(id), titulo: novoTitulo, descricao: novaDescricao, concluida: Boolean(novoConcluida), prazo: novoPrazo
                })
            }
        )
    })
})

app.patch('/tarefas/:id/concluir', (req, res) => {
    const {id} = req.params

    db.get('SELECT * FROM tarefas WHERE id = ?', [id], (err, tarefa) => {
        if(err) {
            return res.status(500).json({èrro: err.message})
        }
        if(!tarefa) {
            return res.status(404).json({erro: "Dados não localizados"})
        }
        
        db.run('UPDATE tarefas SET concluida = 1 WHERE id = ?', [id], function(err) {
            if(err) {
                return res.status(500).json({erro: err.message})
            }
            res.json({id: parseInt(id), titulo: tarefa.titulo, descricao: tarefa.descricao, concluida: true})
        })
    })
})


app.delete('/tarefas/:id', (req, res) => {
    const {id} = req.params

    db.get('SELECT * FROM tarefas WHERE id = ?', [id], (err, tarefa) => {
        if(err) {
            return res.status(500).json({erro: err.message})
        }
        if(!tarefa) {
            return res.status(404).json({erro: "Dados não localizados"})
        }

        db.run('DELETE FROM tarefas WHERE id = ?', [id], function(err) {
            if(err) {
                return res.status(500).json({erro: err.message})
            }
            res.json(tarefa)
        })
    })
})

function isValidDateFormat(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if(!regex.test(dateStr)) {
        return false
    }

    const date = new Date(dateStr)
    const timestamp = date.getTime()

    if(isNaN(timestamp)) {
        return false
    }

    return date.toISOString().split('T')[0] === dateStr
}


app.listen(PORT, () => {
    console.log(`Conectado na URL http://127.0.0.1:${PORT}`)
})