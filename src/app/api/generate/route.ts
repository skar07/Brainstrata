// /app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import type { GenerateRequest, GenerateResponse } from '../../types/api';

// Create once and reuse - initialize outside the handler for better performance
let t5Pipeline: any = null;

async function getT5Pipeline() {
  if (!t5Pipeline) {
    t5Pipeline = await pipeline(
      'text2text-generation',
      'Xenova/LaMini-Flan-T5-248M',   // ✅ 100% supported
      { quantized: true }             // optional: loads the 4‑bit weights
    );
  }
  return t5Pipeline;
}

export async function POST(req: NextRequest) {
  const { prompt } = (await req.json()) as GenerateRequest;
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Empty prompt' }, { status: 400 });
  }

  try {
    const t5 = await getT5Pipeline();
    
    const out = await t5(prompt, {
      max_new_tokens: 100,
      temperature: 0.7,
    });

    const body: GenerateResponse = { text: out[0].generated_text };
    console.log(body);
    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
