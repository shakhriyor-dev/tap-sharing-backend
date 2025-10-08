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
 *     responses:
 *       200:
 *         description: Ссылка создана
 *       400:
 *         description: Некорректные данные (например, отсутствует title или url)
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
 *             required: [title, url]
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ссылка обновлена
 *       400:
 *         description: Некорректные данные (например, отсутствует title или url)
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
    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Поля title и url обязательны" });
    }
    // Простая проверка URL
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: "Некорректный формат url" });
    }
    // Проверка на уникальность title для пользователя
    const existTitle = await Link.findOne({ title, user: req.user.id });
    if (existTitle) {
      return res.status(400).json({ error: "Ссылка с таким title уже существует" });
    }
    const link = await Link.create({ title, url, user: req.user.id });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получить все ссылки пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Обновить ссылку
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, url } = req.body;
    if (url && !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ error: "Некорректный формат url" });
    }
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, url },
      { new: true }
    );
    if (!link) {
      return res.status(404).json({ error: "Ссылка не найдена" });
    }
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удалить ссылку
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!link) {
      return res.status(404).json({ error: "Ссылка не найдена" });
    }
    res.json({ message: "Ссылка удалена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
