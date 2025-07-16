import { NextRequest, NextResponse } from 'next/server';
// import { pipeline } from '@xenova/transformers';
import type { GenerateRequest, GenerateResponse, PromptResponse } from '../../../types/api';
import { OpenAI } from 'openai';

// Comment out T5 pipeline
// let t5Pipeline: any = null;

// async function getT5Pipeline() {
//   if (!t5Pipeline) {
//     t5Pipeline = await pipeline(
//       'text2text-generation',
//       'Xenova/LaMini-Flan-T5-248M',   
//       { quantized: true }         
//     );
//   }
//   return t5Pipeline;
// }

// Initialize OpenAI client with better error handling
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Remove the test response creation
// const response = client.responses.create({
//   model: "gpt-4.1",
//   input: "Write a one-sentence bedtime story about a unicorn."
// });

// console.log(response);

async function generateOpenAIPrompt(prompt: string, context?: string, isChained: boolean = false, imageContext?: string): Promise<string> {
  const messages = [];
  
  // Check if prompt contains image context
  const hasImageContext = prompt.includes('[Image Context:') && prompt.includes(']');
  let cleanPrompt = prompt;
  let extractedImageContext = '';
  
  if (hasImageContext) {
    const match = prompt.match(/\[Image Context: (.*?)\]/);
    if (match) {
      extractedImageContext = match[1];
      cleanPrompt = prompt.replace(/\[Image Context: .*?\]/, '').trim();
    }
  }
  
  if (isChained && context) {
    messages.push({ 
      role: 'system' as const, 
      content: `You are an expert educational AI assistant specializing in creating professional, well-structured learning content. Previous context: ${context}. 

IMPORTANT: Format your response using these professional structures:
- Use "## Heading" for main sections
- Use "### Subheading" for subsections  
- Use "Definition:" for key terms
- Use "Example:" for examples
- Use "Tip:" for helpful tips
- Use "Warning:" for important cautions
- Use "- " for bullet points
- Use "**text**" for emphasis

Create content that is clear, educational, and easy for students to understand.` 
    });
  } else {
    messages.push({ 
      role: 'system' as const, 
      content: `You are an expert educational AI assistant specializing in creating professional, well-structured learning content.

IMPORTANT: Format your response using these professional structures:
- Use "## Heading" for main sections
- Use "### Subheading" for subsections  
- Use "Definition:" for key terms
- Use "Example:" for examples
- Use "Tip:" for helpful tips
- Use "Warning:" for important cautions
- Use "- " for bullet points
- Use "**text**" for emphasis
- remove --- from the response

Create content that is clear, educational, and easy for students to understand. Structure your response with proper headings, definitions, examples, and actionable tips.` 
    });
  }
  
  // Add image context if available
  if (extractedImageContext) {
    messages.push({ 
      role: 'user' as const, 
      content: `Image Analysis: ${extractedImageContext}\n\nUser Question: ${cleanPrompt}` 
    });
  } else {
    messages.push({ role: 'user' as const, content: cleanPrompt });
  }
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    max_tokens: isChained ? 300 : 400,
    temperature: isChained ? 0.7 : 0.6,
  });

  console.log(response.choices[0].message.content);
  
  return response.choices[0].message.content || '';
}

async function generateImage(prompt: string, context?: string, isChained: boolean = false): Promise<string> {
  try {
    // Create an enhanced prompt for image generation
    let imagePrompt = prompt;
    
    if (isChained && context) {
      // For chained conversations, create a more contextual image prompt
      imagePrompt = `Create a visual representation and details explanation of: ${prompt}. Context: ${context}. Style: Educational, clear, colorful, suitable for learning materials. Important: Create a wide landscape image that fits properly in a 16:9 aspect ratio (1920x1080 equivalent) without any content being cut off. Ensure all elements are fully visible within the frame.`;
    } else {
      // For new conversations, enhance the prompt for better image generation
      imagePrompt = `Create a visual representation and details explanation of: ${prompt}. Style: Educational, clear, colorful, suitable for learning materials, scientific illustration. Important: Create a wide landscape image that fits properly in a 16:9 aspect ratio (1920x1080 equivalent) without any content being cut off. Ensure all elements are fully visible within the frame.`;
    }

    console.log('Generating image with prompt:', imagePrompt);

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    console.log('Generated image URL:', imageUrl);
    
    return imageUrl || '';
  } catch (error) {
    console.error('Error generating image:', error);
    return '';
  }
}

function generatePromptVariations(originalPrompt: string, isChained: boolean = false, context?: string): string[] {
  if (isChained && context) {
    // Professional contextual variations for chained conversations
    return [
      `${context} ## ${originalPrompt} - Provide a comprehensive overview with definitions, examples, and practical applications.`, 
      `${context} ### How ${originalPrompt} Works - Explain the process, mechanisms, and step-by-step breakdown.`, 
      `${context} ### Examples and Applications of ${originalPrompt} - Show real-world examples, use cases, and practical implementations.`, 
      `${context} ### Key Insights and Tips about ${originalPrompt} - Share important tips, warnings, and best practices.` 
    ];
  } else {
    // Professional prompt variations for new conversations
    return [
      `## ${originalPrompt} - Provide a comprehensive educational overview with clear definitions, examples, and practical applications. Structure your response professionally with headings, definitions, examples, and tips.`, 
      `### How ${originalPrompt} Works - Explain the process, mechanisms, and provide a step-by-step breakdown with examples.`, 
      `### Examples and Applications of ${originalPrompt} - Show real-world examples, use cases, and practical implementations with clear explanations.`, 
      `### Key Insights and Best Practices for ${originalPrompt} - Share important tips, warnings, common mistakes to avoid, and best practices.` 
    ];
  }
}

function buildContextualPrompt(prompt: string, context?: string, isChained: boolean = false): string {
  if (isChained && context) {
    return `${context} ${prompt}`;
  }
  return prompt;
}

export async function POST(req: NextRequest) {
  const { prompt, context, isChained, generateImage: shouldGenerateImage, streamMode = false } = (await req.json()) as GenerateRequest & { streamMode?: boolean };
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Empty prompt' }, { status: 400 });
  }

  try {
    // Generate prompt variations based on whether this is a chained conversation
    const promptVariations = generatePromptVariations(prompt, isChained, context);
    const responses: PromptResponse[] = [];
    
    if (streamMode) {
      // Stream mode: Process each variation individually and return as they complete
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Send initial response for chat compatibility
            const contextualSimplePrompt = buildContextualPrompt(prompt, context, isChained);
            const simpleResponse = await generateOpenAIPrompt(contextualSimplePrompt, context, isChained);
            
            // Send the simple response first
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'simple',
              text: simpleResponse,
              responses: [],
              imageUrl: ''
            })}\n\n`));

            // Process each variation individually
            for (let i = 0; i < promptVariations.length; i++) {
              const variation = promptVariations[i];
              const contextualVariation = buildContextualPrompt(variation, context, isChained);
              const response = await generateOpenAIPrompt(contextualVariation, context, isChained);
              
              const promptResponse: PromptResponse = {
                prompt: variation,
                response: response
              };
              
              responses.push(promptResponse);
              
              // Send each response as it completes
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'variation',
                index: i,
                response: promptResponse,
                allResponses: responses
              })}\n\n`));
            }

            // Generate image if requested (after all text responses)
            let imageUrl = '';
            if (shouldGenerateImage) {
              console.log('Generating image for prompt:', prompt);
              imageUrl = await generateImage(prompt, context, isChained);
              
              // Send image response
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'image',
                imageUrl: imageUrl
              })}\n\n`));
            }

            // Send final complete response
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'complete',
              text: simpleResponse,
              responses: responses,
              imageUrl: imageUrl
            })}\n\n`));
            
            controller.close();
          } catch (error) {
            controller.error(error);
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
      // Legacy mode: Wait for all responses to complete
      const promises = promptVariations.map(async (variation) => {
        const contextualVariation = buildContextualPrompt(variation, context, isChained);
        const response = await generateOpenAIPrompt(contextualVariation, context, isChained);
        
        return {
          prompt: variation,
          response: response
        };
      });

      // Wait for all responses to complete
      const parallelResponses = await Promise.all(promises);
      responses.push(...parallelResponses);

      // Get a simple response for chat compatibility using OpenAI
      const contextualSimplePrompt = buildContextualPrompt(prompt, context, isChained);
      
      console.log('Sending to OpenAI model:', {
        originalPrompt: prompt,
        context: context,
        finalPrompt: contextualSimplePrompt,
        isChained,
        generateImage: shouldGenerateImage
      });
      
      const simpleResponse = await generateOpenAIPrompt(contextualSimplePrompt, context, isChained);

      // Generate image if requested
      let imageUrl = '';
      if (shouldGenerateImage) {
        console.log('Generating image for prompt:', prompt);
        imageUrl = await generateImage(prompt, context, isChained);
      }

      const body: GenerateResponse = { 
        text: simpleResponse,
        responses: responses,
        imageUrl: imageUrl
      };
      
      console.log('OpenAI model response:', {
        generatedText: simpleResponse,
        isChained,
        hasContext: !!context,
        hasImage: !!imageUrl
      });
      
      return NextResponse.json(body);
    }
  } catch (err) {
    console.error('OpenAI API Error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}