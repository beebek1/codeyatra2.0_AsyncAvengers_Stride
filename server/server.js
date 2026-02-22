import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize, connectDB } from "./src/db/db.js";

// Import your route modules
import rootRouter from "./src/modules/main.router.js";

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// --- Routes ---
app.use("/api", rootRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API Home Page" });
});

// --- Database & Server Start ---
const startServer = async () => {
  const PORT = process.env.PORT || 3000;
  try {
    await connectDB();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); 
  }
};

startServer();