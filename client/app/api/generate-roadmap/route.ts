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

    const systemPrompt = `
                Generate a learning roadmap for "${title}" as a JSON object.
                Each node should have: id, title, type (topic/checkpoint/project), description, position (x, y as percentage), connections (array of ids), and difficulty (beginner/intermediate/advanced).
                
                Structure the roadmap with logical flow:
                - Start with foundational topics
                - Add checkpoints as milestones
                - Include practical projects
                - Connect nodes to show learning progression
                
                Example format:
                {
                    "title": "React Developer",
                    "description": "A comprehensive roadmap for learning React development.",
                    "nodes": [
                        {
                            "id": "start",
                            "title": "Start Here",
                            "type": "topic",
                            "description": "Introduction to React development...",
                            "position": { "x": 50, "y": 10 },
                            "connections": ["html", "javascript"],
                            "difficulty": "beginner"
                        }
                    ]
                }
                
                Make sure to:
                - Include nodes that is enough learn and decide learning path 
                - Have proper connections between related nodes
                - Position nodes to create a logical flow from top to bottom
                - Include appropriate difficulty levels
                - Make descriptions helpful and specific
                - Make provide a **valid JSON 
                Only return valid JSON.
            `;

    const userPrompt = `Generate a detailed roadmap for "${title}".`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0
    });

    const content = response.choices[0].message.content || '';
    console.log("=== RAW AI RESPONSE ===\n", content);

    // Try to directly parse as JSON
    try {
      const direct = JSON.parse(content);
      return NextResponse.json({ roadmap: direct });
    } catch (err) {
      console.warn("Direct JSON.parse failed. Trying extraction...");
    }

    // Try extracting a JSON block using regex
    const match = content.match(/{[\s\S]*}/);
    if (match) {
      try {
        const cleanJson = match[0]
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");
        const extracted = JSON.parse(cleanJson);
        return NextResponse.json({ roadmap: extracted });
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
