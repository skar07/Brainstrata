import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import type { QuizRequest, QuizResponse, QuizQuestion } from '../../../types/api';

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

function generateQuizPrompts(prompt: string, content: string, questionCount: number = 5): string[] {
  const prompts = [
    `Based on this content about "${prompt}": ${content}. Generate a multiple choice question with 4 options and indicate the correct answer.`,
    `From this text about "${prompt}": ${content}. Create a true or false question with explanation.`,
    `Using this information about "${prompt}": ${content}. Write a short answer question that tests understanding.`,
    `Based on this content about "${prompt}": ${content}. Create a fill-in-the-blank question with the missing word.`,
    `From this text about "${prompt}": ${content}. Generate another multiple choice question with different focus.`
  ];
  
  return prompts.slice(0, questionCount);
}

function parseQuizResponse(response: string, type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank'): QuizQuestion {
  const id = Math.random().toString(36).substr(2, 9);
  
  try {
    if (type === 'multiple-choice') {
      const lines = response.split('\n').filter(line => line.trim());
      const question = lines[0]?.replace(/^\d+\.\s*/, '').trim() || response;
      const options: string[] = [];
      let correctAnswer = '';
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^[A-D]\)/)) {
          const option = line.substring(2).trim();
          options.push(option);
          if (line.includes('*') || line.includes('correct') || i === 1) {
            correctAnswer = option;
          }
        }
      }
      
      if (options.length === 0) {
        // Fallback options if parsing fails
        options.push('Option A', 'Option B', 'Option C', 'Option D');
        correctAnswer = 'Option A';
      }
      
      return {
        id,
        type,
        question,
        options,
        correctAnswer: correctAnswer || options[0],
        explanation: `This question tests understanding of ${question.toLowerCase()}`
      };
    }
    
    if (type === 'true-false') {
      const question = response.replace(/true|false/gi, '').trim();
      return {
        id,
        type,
        question,
        options: ['True', 'False'],
        correctAnswer: response.toLowerCase().includes('true') ? 'True' : 'False',
        explanation: 'This is a true/false question based on the content.'
      };
    }
    
    if (type === 'short-answer') {
      return {
        id,
        type,
        question: response.trim(),
        correctAnswer: 'Sample answer based on the content',
        explanation: 'This question requires a short written response.'
      };
    }
    
    if (type === 'fill-in-blank') {
      const question = response.includes('____') ? response : response + ' ____';
      return {
        id,
        type,
        question,
        correctAnswer: 'missing word',
        explanation: 'Fill in the blank with the appropriate word or phrase.'
      };
    }
  } catch (error) {
    console.error('Error parsing quiz response:', error);
  }
  
  // Fallback question
  return {
    id,
    type: 'multiple-choice',
    question: 'What is the main topic discussed in the content?',
    options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
    correctAnswer: 'Topic A',
    explanation: 'This question tests basic comprehension of the content.'
  };
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, generatedContent, questionCount = 5 } = (await req.json()) as QuizRequest;
    
    if (!prompt?.trim() || !generatedContent?.trim()) {
      return NextResponse.json({ error: 'Prompt and generated content are required' }, { status: 400 });
    }

    const t5 = await getT5Pipeline();
    const quizPrompts = generateQuizPrompts(prompt, generatedContent, questionCount);
    const questions: QuizQuestion[] = [];
    
    // Generate questions for each prompt
    const questionTypes: Array<'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank'> = [
      'multiple-choice',
      'true-false', 
      'short-answer',
      'fill-in-blank',
      'multiple-choice'
    ];
    
    for (let i = 0; i < quizPrompts.length; i++) {
      try {
        const response = await t5(quizPrompts[i], {
          max_new_tokens: 150,
          temperature: 0.7,
        });
        
        const question = parseQuizResponse(
          response[0].generated_text,
          questionTypes[i % questionTypes.length]
        );
        
        questions.push(question);
      } catch (error) {
        console.error(`Error generating question ${i + 1}:`, error);
        // Add a fallback question
        questions.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'multiple-choice',
          question: `What aspect of "${prompt}" is most important to understand?`,
          options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
          correctAnswer: 'Concept A',
          explanation: 'This question tests understanding of key concepts.'
        });
      }
    }

    const response: QuizResponse = {
      questions,
      totalQuestions: questions.length
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
} 