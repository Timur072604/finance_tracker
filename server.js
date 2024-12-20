const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'budget-tracker'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NOT NULL
    );
  `;

  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      type ENUM('income', 'expense') NOT NULL,
      category VARCHAR(255),
      userId VARCHAR(255) NOT NULL
    );
  `;

  db.query(createUsersTable, err => {
    if (err) {
      console.error('Error creating users table:', err);
    }
  });

  db.query(createCategoriesTable, err => {
    if (err) {
      console.error('Error creating categories table:', err);
    }
  });

  db.query(createTransactionsTable, err => {
    if (err) {
      console.error('Error creating transactions table:', err);
    }
  });
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: results.insertId, username, email });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

app.get('/api/categories/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM categories WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, userId } = req.body;
  db.query('INSERT INTO categories (name, userId) VALUES (?, ?)', [name, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, name, userId });
  });
});

app.get('/api/transactions/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM transactions WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/transactions', (req, res) => {
  const { date, title, amount, type, category, userId } = req.body;
  db.query('INSERT INTO transactions (date, title, amount, type, category, userId) VALUES (?, ?, ?, ?, ?, ?)', [date, title, amount, type, category, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, date, title, amount, type, category, userId });
  });
});

app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { date, title, amount, type, category, userId } = req.body;
  db.query('UPDATE transactions SET date = ?, title = ?, amount = ?, type = ?, category = ?, userId = ? WHERE id = ?', [date, title, amount, type, category, userId, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, date, title, amount, type, category, userId });
  });
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM transactions WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id });
  });
});

app.put('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const { email, password, newUsername } = req.body;
  db.query('UPDATE users SET username = ?, email = ?, password = ? WHERE username = ?', [newUsername, email, password, username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ username: newUsername, email, password });
  });
});

app.delete('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.query('DELETE FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ username });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
