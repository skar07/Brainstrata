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

function generateQuizPrompts(originalPrompt: string, content: string): Array<{type: string, prompt: string}> {
  const baseContent = `Based on this content about "${originalPrompt}": ${content}`;
  
  return [
    {
      type: 'multiple-choice',
      prompt: `${baseContent} Generate a multiple choice question with 4 options (A, B, C, D) and mark the correct answer:`
    },
    {
      type: 'true-false',
      prompt: `${baseContent} Generate a true or false question and provide the correct answer:`
    },
    {
      type: 'short-answer',
      prompt: `${baseContent} Generate a short answer question that tests understanding:`
    },
    {
      type: 'fill-in-blank',
      prompt: `${baseContent} Generate a fill-in-the-blank question with the answer:`
    }
  ];
}

function parseQuizResponse(response: string, type: string): QuizQuestion {
  const baseQuestion: QuizQuestion = {
    id: Math.random().toString(36).substr(2, 9),
    type: type as 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-in-blank',
    question: '',
    options: [],
    correctAnswer: '',
    explanation: ''
  };

  try {
    switch (type) {
      case 'multiple-choice':
        const mcLines = response.split('\n').filter(line => line.trim());
        baseQuestion.question = mcLines[0] || 'Question not generated properly';
        baseQuestion.options = mcLines.slice(1, 5).map(line => line.replace(/^[A-D][\)\.]\s*/, ''));
        // Try to find correct answer indicator
        const correctLine = mcLines.find(line => line.toLowerCase().includes('correct') || line.toLowerCase().includes('answer'));
        if (correctLine) {
          const match = correctLine.match(/[A-D]/i);
          if (match) {
            const index = match[0].toUpperCase().charCodeAt(0) - 65;
            baseQuestion.correctAnswer = baseQuestion.options[index] || baseQuestion.options[0];
          }
        }
        if (!baseQuestion.correctAnswer) {
          baseQuestion.correctAnswer = baseQuestion.options[0];
        }
        break;

      case 'true-false':
        const tfLines = response.split('\n').filter(line => line.trim());
        baseQuestion.question = tfLines[0] || 'Question not generated properly';
        baseQuestion.options = ['True', 'False'];
        const answerLine = tfLines.find(line => 
          line.toLowerCase().includes('true') || line.toLowerCase().includes('false')
        );
        baseQuestion.correctAnswer = answerLine?.toLowerCase().includes('true') ? 'True' : 'False';
        break;

      case 'short-answer':
        const saLines = response.split('\n').filter(line => line.trim());
        baseQuestion.question = saLines[0] || 'Question not generated properly';
        baseQuestion.correctAnswer = saLines[1] || 'Answer not provided';
        break;

      case 'fill-in-blank':
        const fbLines = response.split('\n').filter(line => line.trim());
        baseQuestion.question = fbLines[0] || 'Question not generated properly';
        baseQuestion.correctAnswer = fbLines[1] || 'Answer not provided';
        break;
    }
  } catch (error) {
    console.error('Error parsing quiz response:', error);
    baseQuestion.question = 'Error generating question';
    baseQuestion.correctAnswer = 'Error';
  }

  return baseQuestion;
}

export async function POST(req: NextRequest) {
  const { prompt, generatedContent } = (await req.json()) as QuizRequest;
  
  if (!prompt?.trim() || !generatedContent?.trim()) {
    return NextResponse.json({ error: 'Prompt and generated content are required' }, { status: 400 });
  }

  try {
    const t5 = await getT5Pipeline();
    
    // Generate different types of quiz questions
    const quizPrompts = generateQuizPrompts(prompt, generatedContent);
    const questions: QuizQuestion[] = [];
    
    // Generate questions in parallel
    const promises = quizPrompts.map(async ({ type, prompt: quizPrompt }) => {
      const out = await t5(quizPrompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
      });
      
      return parseQuizResponse(out[0].generated_text, type);
    });

    // Wait for all questions to be generated
    const generatedQuestions = await Promise.all(promises);
    questions.push(...generatedQuestions.filter((q: QuizQuestion) => q.question && q.question !== 'Error generating question'));

    const response: QuizResponse = {
      questions: questions,
      totalQuestions: questions.length
    };

    console.log('Generated quiz questions:', {
      originalPrompt: prompt,
      questionsCount: response.questions.length,
      questionTypes: response.questions.map((q: QuizQuestion) => q.type)
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error('Quiz generation error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
} 