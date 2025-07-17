import type { NextApiRequest, NextApiResponse } from "next";

import { handleContent } from "./task/content";
import { handleMath } from "./task/math";
import { handleImage } from "./task/image";
import { TaskType } from "@/types/TaskTypes";

type Data = {
  taskType: TaskType;
  result: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { message: string }>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body as { prompt: string };

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const taskType = classifyTask(prompt);
  let result: string;

  switch (taskType) {
    case "content":
      result = await handleContent(prompt);
      break;
    case "math":
      result = await handleMath(prompt);
      break;
    case "image":
      result = await handleImage(prompt);
      break;
    default:
      result = "Unknown task.";
  }

  res.status(200).json({ taskType, result });
}
