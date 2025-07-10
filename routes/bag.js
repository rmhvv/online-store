const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

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

router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT Id, ProductId, Name, Price, Size, Quantity 
     FROM Bag WHERE UserId = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Ошибка БД' });
      res.json(rows);
    }
  );
});


router.post('/add', authenticateToken, (req, res) => {
  const { ProductId, Name, Price, Size, Quantity } = req.body;

  db.run(
    `INSERT INTO Bag (UserId, ProductId, Name, Price, Size, Quantity)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, ProductId, Name, Price, Size, Quantity],
    (err) => {
      if (err) return res.status(500).json({ message: 'Ошибка при добавлении' });
      res.status(201).json({ message: 'Добавлено' });
    }
  );
});


router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    `DELETE FROM Bag WHERE Id = ? AND UserId = ?`,
    [req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Ошибка удаления' });
      res.json({ message: 'Удалено' });
    }
  );
});

module.exports = router;
