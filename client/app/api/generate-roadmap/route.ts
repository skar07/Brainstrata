import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const systemPrompt = `You are a instructor who give guidance to student to approch get the desired goal. Generate a learning roadmap for the: "${title}" as a JSON object. Analyse title and then according to title, title may be the learning topics or career postion(Developer, IPS officer, or any other post).

Each node should include:
- id: unique string
- title: clear and concise
- type: "topic", "checkpoint", or "project"
- description: MUST be between 100–200 words. Describe what the topic is, how it works, why it’s important, and real-world applications. Do NOT use vague verbs like "explore", "understand", "get to know", or "learn about". Instead, give concrete explanations with real meaning.
- position: { "x": number (0–100), "y": number (0–100) }
- connections: array of ids
- difficulty: "beginner", "intermediate", or "advanced"

Structure the roadmap with logical flow:
- Start with foundational topics
- Add checkpoints as milestones
- Include practical projects
- Include subtopics related to the main topic
- Ensure clear connections between nodes
- All descriptions must be helpful, specific, and detailed (100–200 words)

Output format example:
{
  "title": "React Developer",
  "description": "A comprehensive roadmap for learning React development...",
  "nodes": [
    {
      "id": "start",
      "title": "Start Here",
      "type": "topic",
      "description": "React is a JavaScript library for building user interfaces...",
      "position": { "x": 50, "y": 10 },
      "connections": ["html", "javascript"],
      "difficulty": "beginner"
    }
  ]
}

Return only a strict, valid JSON object. No markdown, no comments, no extra explanation.
`;

    const userPrompt = `Generate a detailed roadmap for "${title}".`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 3000,
      temperature: 0
    });

    let content = response.choices[0].message.content || '';

    // Remove markdown wrapping
    content = content.replace(/```(?:json)?|```/g, '').trim();

    // Try to parse raw cleaned content
    try {
      const json = JSON.parse(content);
      return NextResponse.json({ roadmap: json });
    } catch (err) {
      console.warn("Direct JSON.parse failed. Trying regex extraction...");
    }

    // Try extracting JSON using more precise pattern
    const match = content.match(/\{\s*"title"\s*:\s*".+?",[\s\S]+?\}/);
    if (match) {
      try {
        let jsonStr = match[0]
          .replace(/,\s*}/g, '}')  // Remove trailing comma before }
          .replace(/,\s*]/g, ']')  // Remove trailing comma before ]
          .replace(/(\r\n|\n|\r)/gm, '');  // Flatten newlines

        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({ roadmap: parsed });
      } catch (innerErr) {
        console.error("Failed to parse extracted JSON:", innerErr);
      }
    }

    return NextResponse.json({ error: 'Could not parse valid JSON from AI response.' }, { status: 500 });

  } catch (err) {
    console.error('Roadmap generation error:', err);
    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}

