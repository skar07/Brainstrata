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

function generatePromptVariations(originalPrompt: string): string[] {
  return [
    `Explain ${originalPrompt} in simple terms`, 
    `How It Works ${originalPrompt} with more specifics`, 
    `Give examples and practical applications of ${originalPrompt}`, 
    `Provide a scientific explanation of ${originalPrompt} with definitions, formulas, and technical details` 
  ];
}

export async function POST(req: NextRequest) {
  const { prompt } = (await req.json()) as GenerateRequest;
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Empty prompt' }, { status: 400 });
  }

  try {
    const t5 = await getT5Pipeline();
    
    // Generate 4 prompt variations
    const promptVariations = generatePromptVariations(prompt);
    const responses: PromptResponse[] = [];
    
    // Get responses for each variation in parallel for better performance
    const promises = promptVariations.map(async (variation) => {
      const out = await t5(variation, {
        max_new_tokens: 120, // Reduced for faster generation
        temperature: 0.7,
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
    const simpleOut = await t5(prompt, {
      max_new_tokens: 80, // Reduced for faster generation
      temperature: 0.7,
    });

    const body: GenerateResponse = { 
      text: simpleOut[0].generated_text,
      responses: responses
    };
    
    console.log('Generated responses:', body);
    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}