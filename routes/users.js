import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// UPDATE
router.put("/:id", verifyUser, updateUser);

// DELETE
router.delete("/:id", verifyUser, deleteUser);

// GET a single user
router.get("/:id", verifyUser, getUser);

// GET ALL users (fixing middleware order)
router.get("/", verifyToken, verifyAdmin, getUsers);

export default router;
