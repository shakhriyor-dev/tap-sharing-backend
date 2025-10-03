/**
 * @swagger
 * tags:
 *   name: Links
 *   description: Управление ссылками
 */

/**
 * @swagger
 * /links:
 *   post:
 *     summary: Создать новую ссылку
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, url]
 *             properties:
 *               title:
 *                 type: string
 *                 example: GitHub
 *               url:
 *                 type: string
 *                 example: https://github.com
 *               imageUrl:
 *                 type: string
 *                 example: https://cdn-icons-png.flaticon.com/512/25/25231.png
 *     responses:
 *       200:
 *         description: Ссылка создана
 */

/**
 * @swagger
 * /links:
 *   get:
 *     summary: Получить все ссылки пользователя
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список ссылок
 */

/**
 * @swagger
 * /links/{id}:
 *   put:
 *     summary: Обновить ссылку
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ссылка обновлена
 */

/**
 * @swagger
 * /links/{id}:
 *   delete:
 *     summary: Удалить ссылку
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ссылка удалена
 */

const express = require("express");
const Link = require("../models/Link");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Создать ссылку
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, url, imageUrl } = req.body;
    const link = await Link.create({ title, url, imageUrl, user: req.user.id });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получить все ссылки пользователя
router.get("/", authMiddleware, async (req, res) => {
  const links = await Link.find({ user: req.user.id });
  res.json(links);
});

// Обновить ссылку
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, url, imageUrl } = req.body;
  const link = await Link.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, url, imageUrl },
    { new: true }
  );
  res.json(link);
});

// Удалить ссылку
router.delete("/:id", authMiddleware, async (req, res) => {
  await Link.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: "Ссылка удалена" });
});

module.exports = router;
