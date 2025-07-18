import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handleMath(prompt: string, context?: string, isChained?: boolean): Promise<string> {
  try {
    // First, try to use OpenAI for mathematical reasoning
    const messages = [];
    
    const systemPrompt = `You are an expert mathematics tutor. When solving mathematical problems:

1. First, identify the type of problem (arithmetic, algebra, geometry, etc.)
2. Show your step-by-step reasoning
3. Provide the final answer clearly
4. If it's a simple calculation, you can use basic arithmetic
5. Always explain your approach

Format your response with:
- "Problem Type:" 
- "Solution:"
- "Answer:"
- "Explanation:"`;

    messages.push({ role: 'system' as const, content: systemPrompt });
    
    if (context && isChained) {
      messages.push({ 
        role: 'system' as const, 
        content: `Previous context: ${context}. This may be relevant to the current mathematical problem.` 
      });
    }
    
    messages.push({ role: 'user' as const, content: prompt });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 300,
      temperature: 0.3,
    });

    const aiResponse = response.choices[0].message?.content;
    
    // If AI response is good, use it
    if (aiResponse && aiResponse.length > 20) {
      return aiResponse;
    }
    
    // Fallback to safe evaluation for simple expressions
    const expression = prompt.replace(/[^-()\d/*+.\s]/g, ""); // sanitize input
    const result = eval(expression); // Only for simple arithmetic
    
    return `Problem Type: Arithmetic
Solution: ${expression} = ${result}
Answer: ${result}
Explanation: This is a simple arithmetic calculation.`;

  } catch (error) {
    console.error('Math processing error:', error);
    return "I'm sorry, I couldn't process this mathematical problem. Please make sure your question is clear and well-formatted.";
  }
}
  