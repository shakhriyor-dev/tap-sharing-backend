const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const linkRoutes = require("./routes/links");
const swaggerDocs = require("./swagger");

const app = express();
app.use(express.json());

// CORS
app.use(cors({
  origin: "*",  // ⚠️ для теста, потом можно ограничить доменами
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Подключение MongoDB Atlas через .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ DB Connection Error:", err));

// Роуты
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/links", linkRoutes);

// Swagger
swaggerDocs(app);

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000} (API Docs: /api-docs)`)
);
