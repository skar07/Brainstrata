import { Router } from "express";
import { body } from "express-validator";
import { register, login, logout, refresh } from "../controllers/authController";

const router = Router();

router.post("/register", [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
], register);

router.post("/login", [
  body("email").isEmail(),
  body("password").notEmpty()
], login);

router.post("/logout", logout);
router.post("/refresh", refresh);

export default router; 