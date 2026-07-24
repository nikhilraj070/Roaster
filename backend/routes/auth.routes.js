import express from "express"
import { login, logout, register, whoAmI } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleWares.js";
const routes = express.Router();

routes.post("/register",register)
routes.post("/login",login)
routes.post("/logout",logout)
routes.get("/whoami",authMiddleware , whoAmI);

export default routes
