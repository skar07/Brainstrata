import { Request, Response, NextFunction } from "express";

export async function analyzeContextTree(req: Request, res: Response, next: NextFunction) {
  try {
    const { contextTree } = req.body;
    if (!contextTree) return res.status(400).json({ error: "No context tree provided" });

    // Deconstruct the context tree into a flat list of keywords/history
    function flattenTree(node: any, acc: string[] = []) {
      if (!node) return acc;
      if (node.keyword) acc.push(node.keyword);
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) flattenTree(child, acc);
      }
      return acc;
    }
    const keywords = flattenTree(contextTree);
    const prompt = `Given the following learning history and keywords: ${keywords.join(", ")}, generate a detailed personalized learning roadmap for the next steps, including topics, skills, and suggested order. Format as a JSON roadmap.`;

    // Call Hugging Face Inference API (text generation)
    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
    const HF_MODEL = "meta-llama/Llama-2-70b-chat-hf"; // or any suitable model
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: "Hugging Face API error", details: error });
    }
    const data = await response.json();
    // Hugging Face returns an array of generated texts
    const roadmap = data[0]?.generated_text || data.generated_text || data;
    res.json({ roadmap });
  } catch (err) {
    next(err);
  }
} 