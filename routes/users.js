/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление профилем пользователей
 */

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Получить публичный профиль
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Профиль найден
 *
 * /users/me:
 *   put:
 *     summary: Обновить свой профиль
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Профиль обновлён
 */

const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Инфо о текущем пользователе
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получить публичный профиль по username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password -email");
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Обновить свой профиль
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    // Проверки: можно добавить ограничения по длине, формату и т.д.
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Некорректное имя" });
    }
    if (bio && typeof bio !== "string") {
      return res.status(400).json({ error: "Некорректная биография" });
    }
    if (avatar && typeof avatar !== "string") {
      return res.status(400).json({ error: "Некорректный формат avatar" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatar },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
