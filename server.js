require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';


function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Неверный токен' });
    req.user = user;
    next();
  });
}


app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE Email = ?', [email], async (err, row) => {
    if (row) return res.status(400).json({ message: 'Пользователь уже существует' });

    const hashed = await bcrypt.hash(password, 10);
    db.run('INSERT INTO Users (Email, Password) VALUES (?, ?)', [email, hashed], err => {
      if (err) return res.status(500).json({ message: 'Ошибка БД' });
      res.status(201).json({ message: 'Регистрация прошла успешно' });
    });
  });
});


app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE Email = ?', [email], async (err, user) => {
    if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

    const match = await bcrypt.compare(password, user.Password);
    if (!match) return res.status(400).json({ message: 'Неверный пароль' });

    const token = jwt.sign({ id: user.Id, email: user.Email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.Id, email: user.Email } });
  });
});


app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT Id, Email FROM Users WHERE Id = ?', [req.user.id], (err, user) => {
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  });
});


const bagRoutes = require('./routes/bag');
app.use('/api/bag', bagRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
