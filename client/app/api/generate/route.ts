import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import type { GenerateRequest, GenerateResponse, PromptResponse } from '../../../types/api';

let t5Pipeline: any = null;

async function getT5Pipeline() {
  if (!t5Pipeline) {
    t5Pipeline = await pipeline(
      'text2text-generation',
      'Xenova/LaMini-Flan-T5-248M',   
      { quantized: true }         
    );
  }
  return t5Pipeline;
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
    const t5 = await getT5Pipeline();
    
    // Generate prompt variations based on whether this is a chained conversation
    const promptVariations = generatePromptVariations(prompt, isChained, context);
    const responses: PromptResponse[] = [];
    
    // Get responses for each variation in parallel for better performance
    const promises = promptVariations.map(async (variation) => {
      const contextualVariation = buildContextualPrompt(variation, context, isChained);
      const out = await t5(contextualVariation, {
        max_new_tokens: isChained ? 140 : 120, // Slightly longer responses for chained prompts
        temperature: isChained ? 0.8 : 0.7, // Slightly more creative for chained responses
      });
      
      return {
        prompt: variation,
        response: out[0].generated_text
      };
    });

    // Wait for all responses to complete
    const parallelResponses = await Promise.all(promises);
    responses.push(...parallelResponses);

    // Get a simple response for chat compatibility
    const contextualSimplePrompt = buildContextualPrompt(prompt, context, isChained);
    
    console.log('Sending to T5 model:', {
      originalPrompt: prompt,
      context: context,
      finalPrompt: contextualSimplePrompt,
      isChained
    });
    
    const simpleOut = await t5(contextualSimplePrompt, {
      max_new_tokens: isChained ? 100 : 80,
      temperature: isChained ? 0.8 : 0.7,
    });

    const body: GenerateResponse = { 
      text: simpleOut[0].generated_text,
      responses: responses
    };
    
    console.log('T5 model response:', {
      generatedText: simpleOut[0].generated_text,
      isChained,
      hasContext: !!context
    });
    
    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}