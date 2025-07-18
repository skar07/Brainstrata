import { NextRequest, NextResponse } from 'next/server';
import { handleContent } from "../task/content";
import { handleMath } from "../task/math";
import { handleImage } from "../task/image";
import { TaskType } from "@/types/TaskTypes";

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

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, isChained, streamMode = false } = await req.json();
    
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Empty prompt' }, { status: 400 });
    }

    const taskType = classifyTask(prompt);
    console.log(`Task classified as: ${taskType} for prompt: "${prompt}"`);

    if (streamMode) {
      // Stream mode for real-time responses
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
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
                result = "Unknown task type.";
            }

            // Send the result
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'task-result',
              taskType: taskType,
              result: result
            })}\n\n`));
            
            controller.close();
          } catch (error) {
            console.error('Task processing error:', error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'error',
              error: 'Failed to process task'
            })}\n\n`));
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming mode
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
          result = "Unknown task type.";
      }

      return NextResponse.json({ 
        taskType, 
        result,
        success: true 
      });
    }

  } catch (error) {
    console.error('Task routing error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 