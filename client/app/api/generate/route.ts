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

const client = new OpenAI();

// Remove the test response creation
// const response = client.responses.create({
//   model: "gpt-4.1",
//   input: "Write a one-sentence bedtime story about a unicorn."
// });

// console.log(response);

async function generateOpenAIPrompt(prompt: string, context?: string, isChained: boolean = false): Promise<string> {
  const messages = [];
  
  if (isChained && context) {
    messages.push({ 
      role: 'system' as const, 
      content: `You are a helpful AI assistant. Previous context: ${context}. Continue the conversation naturally.` 
    });
  } else {
    messages.push({ 
      role: 'system' as const, 
      content: 'You are a helpful AI assistant that explains concepts clearly and provides useful information.' 
    });
  }
  
  messages.push({ role: 'user' as const, content: prompt });
  
  const response = await client.chat.completions.create({
    model: 'gpt-4.1',
    messages: messages,
    max_tokens: isChained ? 200 : 150,
    temperature: isChained ? 0.8 : 0.7,
  });
  
  return response.choices[0].message.content || '';
}

function generatePromptVariations(originalPrompt: string, isChained: boolean = false, context?: string): string[] {
  if (isChained && context) {
    // Very simple contextual variations - just add the context as background
    return [
      `${context} ${originalPrompt}`, 
      `${context} How does ${originalPrompt} work?`, 
      `${context} Examples of ${originalPrompt}`, 
      `${context} More about ${originalPrompt}` 
    ];
  } else {
    // Standard prompt variations for new conversations
    return [
      `Explain ${originalPrompt}`, 
      `How does ${originalPrompt} work?`, 
      `Give examples of ${originalPrompt}`, 
      `Tell me about ${originalPrompt}` 
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
  const { prompt, context, isChained } = (await req.json()) as GenerateRequest;
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Empty prompt' }, { status: 400 });
  }

  try {
    // Comment out T5 pipeline usage
    // const t5 = await getT5Pipeline();
    
    // Generate prompt variations based on whether this is a chained conversation
    const promptVariations = generatePromptVariations(prompt, isChained, context);
    const responses: PromptResponse[] = [];
    
    // Get responses for each variation using OpenAI instead of T5
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
      isChained
    });
    
    const simpleResponse = await generateOpenAIPrompt(contextualSimplePrompt, context, isChained);

    const body: GenerateResponse = { 
      text: simpleResponse,
      responses: responses
    };
    
    console.log('OpenAI model response:', {
      generatedText: simpleResponse,
      isChained,
      hasContext: !!context
    });
    
    return NextResponse.json(body);
  } catch (err) {
    console.error('OpenAI API Error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}