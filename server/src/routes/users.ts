import { Router } from "express";
import { getMe, getUserById } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const router = Router();

router.get("/me", authenticate, getMe);
router.get("/:id", authenticate, getUserById);

export default router; 