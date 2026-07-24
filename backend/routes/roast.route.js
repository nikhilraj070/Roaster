import express from "express";

import {
  createRoast,
  getFavorites,
  getHistory,
  updateFavorite,
} from "../controllers/roast.controller.js";

import { authMiddleware } from "../middleware/authMiddleWares.js";

const router = express.Router();


router.post("/", authMiddleware, createRoast);
router.get("/favorites", authMiddleware, getFavorites);
router.get("/history", authMiddleware, getHistory);
router.patch("/:id/favorite", authMiddleware, updateFavorite);



export default router;
