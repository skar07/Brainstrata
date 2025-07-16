import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = imageFile.type;

    // Analyze image using OpenAI Vision
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert image analyzer. Analyze the uploaded image and provide a detailed description of what you see. Focus on identifying objects, text, diagrams, charts, or any visual elements that could be relevant for educational purposes. Be thorough but concise."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this image and provide a detailed description of what you see. Include any text, diagrams, charts, or visual elements that could be relevant for answering questions about this image."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const analysis = response.choices[0]?.message?.content || 'Unable to analyze image';
    
    return NextResponse.json({ 
      analysis,
      success: true 
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
} 