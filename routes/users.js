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
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Обновить свой профиль
 */
router.put("/me", auth, async (req, res) => {
  const { name, bio, avatar } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.name = name ?? user.name;
  user.bio = bio ?? user.bio;
  user.avatar = avatar ?? user.avatar;
  await user.save();

  res.json(user);
});

module.exports = router;
