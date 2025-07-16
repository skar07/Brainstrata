import { Router } from "express";
import { analyzeContextTree } from "../controllers/contextController";
import authenticate from "../middleware/authenticate";

const router = Router();

router.post("/analyze", authenticate, analyzeContextTree);

export default router; 