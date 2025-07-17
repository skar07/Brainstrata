import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const systemPrompt = `
You are a helpful assistant. 
When given a topic, generate a **brief, engaging, well-structured explanation** of it.
Format the response using simple HTML tags like <h2>, <p>, <ul><li> if it makes sense, to improve readability.
Keep it under 200 words, make it concise but insightful.
Only return the HTML content — no JSON, no comments.
`;

    const userPrompt = `Write a brief explanation for "${title}".`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.5
    });

    const content = response.choices[0].message.content || '';
    console.log("=== RAW AI RESPONSE ===\n", content);

    return NextResponse.json({ content });

  } catch (err) {
    console.error('Content generation error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
