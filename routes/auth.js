//swagger documentation
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Регистрация и авторизация
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               email:
 *                 type: string
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Пользователь создан
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Успешный вход (возвращает JWT токен)
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Все поля обязательны: username, email, password" });
    }
    const existUser = await User.findOne({ username });
    if (existUser) return res.status(400).json({ error: "Пользователь с таким username уже существует" });

    const existEmail = await User.findOne({ email });
    if (existEmail) return res.status(400).json({ error: "Пользователь с таким email уже существует" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.json({ message: "Пользователь создан", user });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Логин
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Неверные данные" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Неверные данные" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
