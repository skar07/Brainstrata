import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import type { QuizRequest, QuizResponse, QuizQuestion } from '../../../types/api';

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateQuizQuestion(
  prompt: string, 
  content: string, 
  questionType: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank' | 'drag-drop',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion> {
  let systemPrompt = '';
  let userPrompt = '';

  switch (questionType) {
    case 'multiple-choice':
      systemPrompt = `You are an expert educator creating high-quality multiple choice quiz questions. 
      Generate a ${difficulty} level question with exactly 4 options (A, B, C, D) based on the content provided.
      Return your response as valid JSON with this exact structure:
      {
        "question": "Your question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option X",
        "explanation": "Why this answer is correct and others are wrong"
      }`;
      break;

    case 'true-false':
      systemPrompt = `You are an expert educator creating true/false quiz questions.
      Generate a ${difficulty} level true or false question based on the content provided.
      Return your response as valid JSON with this exact structure:
      {
        "question": "Your statement here",
        "correctAnswer": "true" or "false",
        "explanation": "Explanation of why this is true or false"
      }`;
      break;

    case 'short-answer':
      systemPrompt = `You are an expert educator creating short answer quiz questions.
      Generate a ${difficulty} level question that requires a brief written response based on the content provided.
      Return your response as valid JSON with this exact structure:
      {
        "question": "Your question here?",
        "correctAnswer": "Expected answer or key points",
        "explanation": "What makes a good answer to this question"
      }`;
      break;

    case 'fill-in-blank':
      systemPrompt = `You are an expert educator creating fill-in-the-blank quiz questions with drag-and-drop options.
      Generate a ${difficulty} level statement with one key word or phrase replaced by _____ based on the content provided.
      Also provide 4 options where only one is correct for drag-and-drop functionality.
      Return your response as valid JSON with this exact structure:
      {
        "question": "Your statement with _____ in place of the missing word",
        "options": ["Correct answer", "Wrong option 1", "Wrong option 2", "Wrong option 3"],
        "correctAnswer": "Correct answer",
        "explanation": "Why this word/phrase is correct and important in this context"
      }`;
      break;

    case 'drag-drop':
      systemPrompt = `You are an expert educator creating drag-and-drop ordering quiz questions.
      Generate a ${difficulty} level question where students need to arrange items in the correct order based on the content provided.
      Create 4-5 items that need to be ordered (steps in a process, chronological events, hierarchy, etc.).
      Return your response as valid JSON with this exact structure:
      {
        "question": "Arrange these items in the correct order:",
        "dragItems": [
          {"id": "item1", "text": "First item", "correctOrder": 1},
          {"id": "item2", "text": "Second item", "correctOrder": 2},
          {"id": "item3", "text": "Third item", "correctOrder": 3},
          {"id": "item4", "text": "Fourth item", "correctOrder": 4}
        ],
        "correctAnswer": "item1,item2,item3,item4",
        "explanation": "Why this order is correct"
      }`;
      break;
  }

  userPrompt = `Topic: "${prompt}"
  Content: "${content}"
  
  Create a ${difficulty} level ${questionType} question based on this content. Focus on testing understanding of key concepts, not just memorization.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content || '';
    const questionData = JSON.parse(responseText);

    const question: QuizQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      type: questionType,
      question: questionData.question,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      difficulty: difficulty,
      ...((questionType === 'multiple-choice' || questionType === 'fill-in-blank') && { options: questionData.options }),
      ...(questionType === 'drag-drop' && { dragItems: questionData.dragItems }),
    };

    return question;
  } catch (error) {
    console.error(`Error generating ${questionType} question:`, error);
    
    // Fallback question
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'multiple-choice',
      question: `What is a key concept related to "${prompt}"?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 'Concept A',
      explanation: 'This question tests understanding of key concepts.',
      difficulty: difficulty
    };
  }
}



export async function POST(req: NextRequest) {
  try {
    const { prompt, generatedContent, questionCount = 5 } = (await req.json()) as QuizRequest;
    
    if (!prompt?.trim() || !generatedContent?.trim()) {
      return NextResponse.json({ error: 'Prompt and generated content are required' }, { status: 400 });
    }

    const questions: QuizQuestion[] = [];
    
    // Define question types and difficulties for variety
    const questionTypes: Array<'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank' | 'drag-drop'> = [
      'multiple-choice',
      'fill-in-blank', 
      'true-false',
      'fill-in-blank',
      'drag-drop'
    ];
    
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard', 'medium', 'easy'];
    
    // Generate questions using OpenAI
    for (let i = 0; i < Math.min(questionCount, questionTypes.length); i++) {
      try {
        console.log(`Generating ${questionTypes[i]} question ${i + 1}/${questionCount}`);
        
        const question = await generateQuizQuestion(
          prompt,
          generatedContent,
          questionTypes[i],
          difficulties[i % difficulties.length]
        );
        
        questions.push(question);
        
        // Add a small delay to avoid rate limiting
        if (i < questionCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error generating question ${i + 1}:`, error);
        
        // Add a fallback question on error
        questions.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'multiple-choice',
          question: `What is a key concept related to "${prompt}"?`,
          options: [
            'A fundamental principle or idea',
            'An unrelated topic',
            'A minor detail',
            'A random fact'
          ],
          correctAnswer: 'A fundamental principle or idea',
          explanation: 'Key concepts are the fundamental principles or ideas that are central to understanding a topic.',
          difficulty: 'easy'
        });
      }
    }

    // Ensure we have at least one question
    if (questions.length === 0) {
      questions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'multiple-choice',
        question: `Based on the content about "${prompt}", what would be the most important aspect to remember?`,
        options: [
          'The main concepts and principles',
          'Only specific details',
          'Unrelated information',
          'Random facts'
        ],
        correctAnswer: 'The main concepts and principles',
        explanation: 'Understanding the main concepts and principles is crucial for grasping any topic effectively.',
        difficulty: 'medium'
      });
    }

    const response: QuizResponse = {
      questions,
      totalQuestions: questions.length
    };
    
    console.log(`Successfully generated ${questions.length} questions for topic: "${prompt}"`);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz. Please make sure your OpenAI API key is configured correctly.' },
      { status: 500 }
    );
  }
} 