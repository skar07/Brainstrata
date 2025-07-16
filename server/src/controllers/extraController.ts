import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { score: "desc" },
      include: { user: { select: { id: true, name: true } } },
      take: 100
    });
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
}

export async function getUserLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const entry = await prisma.leaderboard.findUnique({
      where: { userId: id },
      include: { user: { select: { id: true, name: true } } }
    });
    if (!entry) return res.status(404).json({ error: "User not found in leaderboard" });
    // Calculate rank
    const higherScores = await prisma.leaderboard.count({ where: { score: { gt: entry.score } } });
    res.json({ ...entry, rank: higherScores + 1 });
  } catch (err) {
    next(err);
  }
}

export async function getPricingPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const plans = await prisma.pricingPlan.findMany();
    res.json(plans);
  } catch (err) {
    next(err);
  }
} 