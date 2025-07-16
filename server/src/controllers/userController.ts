import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getAuthUserId(req: Request) {
  // Support both OAuth and local JWT
  return (req as any).user?.id || (req as any).auth?.sub;
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const authUserId = getAuthUserId(req);
    if (id !== authUserId) return res.status(403).json({ error: "Forbidden" });
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        settings: true,
        pricingPlan: true,
        leaderboard: true,
        enrollments: { include: { course: true } }
      }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUserSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const authUserId = getAuthUserId(req);
    if (id !== authUserId) return res.status(403).json({ error: "Forbidden" });
    const { preferences } = req.body;
    const settings = await prisma.settings.upsert({
      where: { userId: id },
      update: { preferences },
      create: { userId: id, preferences }
    });
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

export async function getUserCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const authUserId = getAuthUserId(req);
    if (id !== authUserId) return res.status(403).json({ error: "Forbidden" });
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: id },
      include: { course: true }
    });
    res.json(enrollments.map((e: any) => e.course));
  } catch (err) {
    next(err);
  }
}

export async function enrollInCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, courseId } = req.params;
    const authUserId = getAuthUserId(req);
    if (id !== authUserId) return res.status(403).json({ error: "Forbidden" });
    const enrollment = await prisma.enrollment.create({
      data: { userId: id, courseId }
    });
    res.json(enrollment);
  } catch (err) {
    next(err);
  }
}

export async function updateUserPricingPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { pricingPlanId } = req.body;
    const authUserId = getAuthUserId(req);
    if (id !== authUserId) return res.status(403).json({ error: "Forbidden" });
    const user = await prisma.user.update({
      where: { id },
      data: { pricingPlanId }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
} 