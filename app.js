const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database(':memory:');

// Create a users table
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT)");
  db.run("INSERT INTO users (name, password) VALUES ('admin', 'admin123')");
});

// Vulnerable endpoint
app.get('/user', (req, res) => {
  const name = req.query.name;

  // ❌ SQL Injection Vulnerability
  const query = `SELECT * FROM users WHERE name = '${name}'`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
