/**
 * @swagger
 * tags:
 *   name: Links
 *   description: Управление ссылками пользователя
 */

/**
 * @swagger
 * /links:
 *   post:
 *     summary: Добавить ссылку пользователю
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Ссылка добавлена
 *
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
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();


router.post("/", auth, async (req, res) => {
  const { title, url } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.links.push({ title, url, order: user.links.length });
  await user.save();

  res.json(user);
});

/**
 * @swagger
 * /links/{id}:
 *   delete:
 *     summary: Удалить ссылку
 */
router.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.links = user.links.filter((l) => l._id.toString() !== req.params.id);
  await user.save();

  res.json(user);
});

module.exports = router;
