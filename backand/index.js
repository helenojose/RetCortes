const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database('./agendamentos.db');

// Middleware
app.use(express.json());
app.use(cors());

// Criação da tabela de agendamentos (caso não exista)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS agendamentos (id INTEGER PRIMARY KEY, nome TEXT, data TEXT, hora TEXT, servico TEXT, valor REAL)");
});

// Rota para buscar todos os agendamentos
app.get('/appointments', (req, res) => {
  db.all("SELECT * FROM agendamentos", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ agendamentos: rows });
  });
});

// Rota para adicionar um novo agendamento
app.post('/appointments', (req, res) => {
  const { nome, data, hora, servico, valor } = req.body;
  
  // Verificando se todos os campos necessários foram preenchidos
  if (!nome || !data || !hora || !servico || !valor) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const stmt = db.prepare("INSERT INTO agendamentos (nome, data, hora, servico, valor) VALUES (?, ?, ?, ?, ?)");
  stmt.run(nome, data, hora, servico, valor, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, nome, data, hora, servico, valor });
  });
});

// Inicia o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
