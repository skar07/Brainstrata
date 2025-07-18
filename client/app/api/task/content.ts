import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handleContent(prompt: string, context?: string, isChained?: boolean): Promise<string> {
  const messages = [];
  
  // Enhanced system prompt for educational content
  const systemPrompt = `You are an expert educational AI assistant specializing in creating professional, well-structured learning content.

IMPORTANT: Format your response using these professional structures:
- Use "## Heading" for main sections
- Use "### Subheading" for subsections  
- Use "Definition:" for key terms
- Use "Example:" for examples
- Use "Tip:" for helpful tips
- Use "Warning:" for important cautions
- Use "- " for bullet points
- Use "**text**" for emphasis

Create content that is clear, educational, and easy for students to understand.`;

  messages.push({ role: 'system' as const, content: systemPrompt });
  
  // Add context if available (for chained conversations)
  if (context && isChained) {
    messages.push({ 
      role: 'system' as const, 
      content: `Previous conversation context: ${context}. Build upon this context in your response.` 
    });
  }
  
  messages.push({ role: 'user' as const, content: prompt });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: isChained ? 300 : 400,
    temperature: isChained ? 0.7 : 0.6,
  });

  return response.choices[0].message?.content ?? "No response from model.";
}
