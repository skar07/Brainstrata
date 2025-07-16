import { Router } from "express";
import {
  getUser,
  updateUserSettings,
  getUserCourses,
  enrollInCourse,
  updateUserPricingPlan
} from "../controllers/userController";
import { getLeaderboard, getUserLeaderboard, getPricingPlans } from "../controllers/extraController";
import authenticate from "../middleware/authenticate";

const router = Router();

router.get("/:id", authenticate, getUser);
router.put("/:id/settings", authenticate, updateUserSettings);
router.get("/:id/courses", authenticate, getUserCourses);
router.post("/:id/courses/:courseId/enroll", authenticate, enrollInCourse);
router.put("/:id/pricing-plan", authenticate, updateUserPricingPlan);

// Leaderboard
router.get("/leaderboard", authenticate, getLeaderboard);
router.get("/leaderboard/:id", authenticate, getUserLeaderboard);
// Pricing plans
router.get("/pricing-plans", authenticate, getPricingPlans);

export default router; 