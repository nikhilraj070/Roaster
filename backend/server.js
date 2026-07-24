import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import roastRoutes from "./routes/roast.route.js";


dotenv.config();

const app = express();
app.use(cors({
  origin:"https://roaster-hnhg.onrender.com",
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/roast", roastRoutes);
 const PORT = process.env.PORT || 8000
const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT , () => {
      console.log("Database connected successfully");
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
