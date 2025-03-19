import express from "express";
import { login, register, changePassword, signout } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.put("/:id", changePassword)
router.post("/signout", signout)


export default router