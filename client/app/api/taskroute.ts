import type { NextApiRequest, NextApiResponse } from "next";

import { handleContent } from "./task/content";
import { handleMath } from "./task/math";
import { handleImage } from "./task/image";
import { TaskType } from "@/types/TaskTypes";

type Data = {
  taskType: TaskType;
  result: string;
};

// Task classification function
function classifyTask(prompt: string): TaskType {
  const lowerPrompt = prompt.toLowerCase();
  
  // Math task patterns
  const mathPatterns = [
    /calculate|compute|solve|evaluate|sum|add|subtract|multiply|divide/,
    /[0-9+\-*/()=<>]+/, // Contains mathematical operators
    /what is \d+[\+\-\*\/]\d+/,
    /solve for [a-z]/,
    /equation|formula|mathematical/,
    /percentage|percent|%/
  ];
  
  // Image generation task patterns
  const imagePatterns = [
    /generate.*image|create.*image|make.*image|draw.*image/,
    /visualize|visualization|picture|photo|drawing/,
    /show me.*image|display.*image/,
    /generate.*picture|create.*picture/,
    /image of|picture of|photo of/
  ];
  
  // Check for math tasks first (more specific)
  for (const pattern of mathPatterns) {
    if (pattern.test(lowerPrompt)) {
      return "math";
    }
  }
  
  // Check for image generation tasks
  for (const pattern of imagePatterns) {
    if (pattern.test(lowerPrompt)) {
      return "image";
    }
  }
  
  // Default to content generation for everything else
  return "content";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { message: string }>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt, context, isChained } = req.body as { 
    prompt: string; 
    context?: string; 
    isChained?: boolean; 
  };

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const taskType = classifyTask(prompt);
  let result: string;

  switch (taskType) {
    case "content":
      result = await handleContent(prompt, context, isChained);
      break;
    case "math":
      result = await handleMath(prompt, context, isChained);
      break;
    case "image":
      result = await handleImage(prompt, context, isChained);
      break;
    default:
      result = "Unknown task.";
  }

  res.status(200).json({ taskType, result });
}
