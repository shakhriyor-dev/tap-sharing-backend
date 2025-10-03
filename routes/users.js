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
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
