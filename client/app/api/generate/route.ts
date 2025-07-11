import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import type { GenerateRequest, GenerateResponse, QuizQuestion } from '../../../types/api';

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

// Helper function to extract key phrases from content
function extractKeyPhrases(content: string): string[] {
  const phrases = [];
  const words = content.split(/\s+/);
  
  // Look for capitalized phrases (2-3 words)
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].match(/^[A-Z][a-z]+/) && words[i + 1].match(/^[A-Z][a-z]+/)) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }
  }
  
  return phrases.filter(phrase => phrase.length > 5).slice(0, 3);
}

// Helper function to extract facts from content
function extractFacts(content: string): string[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.filter(s => 
    s.includes('is') || s.includes('are') || s.includes('was') || s.includes('were') ||
    s.includes('has') || s.includes('have') || s.includes('had')
  ).slice(0, 3);
}

// Function to analyze content and generate fully dynamic quiz questions
function generateContentBasedQuestions(content: string, originalPrompt: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const baseId = Date.now();
  
  console.log('Analyzing content for dynamic quiz generation:', content.substring(0, 200) + '...');
  
  // Extract key information from content
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15);
  const words = content.toLowerCase().split(/\s+/);
  
  // Find important concepts, numbers, dates, and key terms
  const numbers = content.match(/\d+/g) || [];
  const years = content.match(/\b(19|20)\d{2}\b/g) || [];
  const capitalizedWords = content.match(/[A-Z][a-z]+/g) || [];
  const importantTerms = capitalizedWords.filter(word => 
    word.length > 3 && !['The', 'This', 'That', 'When', 'Where', 'What', 'How', 'Why', 'They', 'These', 'Some', 'Many', 'Most', 'Such', 'Through', 'During', 'After', 'Before'].includes(word)
  );
  
  // Extract key phrases and concepts
  const keyPhrases = extractKeyPhrases(content);
  const facts = extractFacts(content);
  
  // Generate questions based on content analysis
  let questionCount = 0;
  
  // 1. Multiple choice question from actual content concepts
  if (importantTerms.length >= 4 && questionCount < 5) {
    const correctTerm = importantTerms[0];
    const contextSentence = sentences.find(s => s.includes(correctTerm));
    
    if (contextSentence) {
      // Create dynamic options from the content
      const options = [
        correctTerm,
        ...importantTerms.slice(1, 4).filter(term => term !== correctTerm)
      ];
      
      // Shuffle options
      const shuffledOptions = options.sort(() => Math.random() - 0.5);
      
      questions.push({
        id: `quiz-${baseId}-${++questionCount}`,
        type: 'multiple-choice',
        question: `Which of the following is prominently discussed in the content?`,
        options: shuffledOptions.slice(0, 4),
        correctAnswer: correctTerm,
        explanation: `${correctTerm} is a key concept mentioned: "${contextSentence.substring(0, 100)}..."`,
        difficulty: 2
      });
    }
  }
  
  // 2. True/False question from content facts
  if (sentences.length > 1 && questionCount < 5) {
    const factSentence = sentences[Math.floor(sentences.length / 2)];
    const cleanSentence = factSentence.trim().replace(/^[^A-Za-z]*/, '');
    
    if (cleanSentence.length > 20 && cleanSentence.length < 100) {
      questions.push({
        id: `quiz-${baseId}-${++questionCount}`,
        type: 'true-false',
        question: cleanSentence.endsWith('.') ? cleanSentence : cleanSentence + '.',
        correctAnswer: true,
        explanation: 'This statement is directly mentioned in the content.',
        difficulty: 1
      });
    }
  }
  
  // 3. Fill in the blank from key terms
  if (importantTerms.length > 0 && questionCount < 5) {
    const keyTerm = importantTerms[Math.floor(importantTerms.length / 2)];
    const sentenceWithTerm = sentences.find(s => s.includes(keyTerm) && s.length < 120);
    
    if (sentenceWithTerm) {
      const blankSentence = sentenceWithTerm.replace(new RegExp(keyTerm, 'g'), '________');
      questions.push({
        id: `quiz-${baseId}-${++questionCount}`,
        type: 'fill-blank',
        question: blankSentence.trim().endsWith('.') ? blankSentence.trim() : blankSentence.trim() + '.',
        correctAnswer: keyTerm,
        explanation: `The missing term is "${keyTerm}" which is discussed in the content.`,
        difficulty: 2
      });
    }
  }
  
  // 4. Short answer about specific content detail
  if (keyPhrases.length > 0 && questionCount < 5) {
    const keyPhrase = keyPhrases[0];
    questions.push({
      id: `quiz-${baseId}-${++questionCount}`,
      type: 'short-answer',
      question: `What is the main point made about ${keyPhrase.toLowerCase()}?`,
      correctAnswer: `Key information about ${keyPhrase.toLowerCase()} as discussed in the content`,
      explanation: 'This question tests your understanding of the specific details presented.',
      difficulty: 3
    });
  }
  
  // 5. Multiple choice about specific details or numbers
  if (numbers.length > 0 && questionCount < 5) {
    const number = numbers[0];
    const contextSentence = sentences.find(s => s.includes(number));
    
    if (contextSentence) {
      // Create dynamic options based on context
      const otherNumbers = numbers.slice(1, 4);
      const options = [number];
      
      // Add other numbers from content or generate plausible alternatives
      otherNumbers.forEach(num => {
        if (options.length < 4) options.push(num);
      });
      
      // Fill remaining options with plausible alternatives
      while (options.length < 4) {
        const baseNum = parseInt(number);
        const altNum = isNaN(baseNum) ? (Math.floor(Math.random() * 100) + 1).toString() : 
                      (baseNum + Math.floor(Math.random() * 20) - 10).toString();
        if (!options.includes(altNum)) {
          options.push(altNum);
        }
      }
      
      questions.push({
        id: `quiz-${baseId}-${++questionCount}`,
        type: 'multiple-choice',
        question: `What number is mentioned in the content?`,
        options: options.slice(0, 4),
        correctAnswer: number,
        explanation: `The number ${number} appears in context: "${contextSentence.substring(0, 100)}..."`,
        difficulty: 2
      });
    }
  } else if (years.length > 0 && questionCount < 5) {
    // Year-based question
    const year = years[0];
    const contextSentence = sentences.find(s => s.includes(year));
    
    if (contextSentence) {
      const baseYear = parseInt(year);
      const options = [
        year,
        (baseYear - 10).toString(),
        (baseYear + 15).toString(),
        (baseYear - 25).toString()
      ];
      
      questions.push({
        id: `quiz-${baseId}-${++questionCount}`,
        type: 'multiple-choice',
        question: `Which year is mentioned in the content?`,
        options: options.sort(() => Math.random() - 0.5),
        correctAnswer: year,
        explanation: `The year ${year} is mentioned in the content.`,
        difficulty: 2
      });
    }
  } else if (questionCount < 5) {
    // Alternative question using content concepts
    if (importantTerms.length >= 2) {
      const term1 = importantTerms[0];
      const term2 = importantTerms[1];
      const otherTerms = importantTerms.slice(2, 4);
      
      questions.push({
        id: `quiz-${baseId}-${++questionCount}`,
        type: 'multiple-choice',
        question: `Which concept is most emphasized in the content?`,
        options: [term1, term2, ...otherTerms].slice(0, 4),
        correctAnswer: term1,
        explanation: `${term1} is the most prominently discussed concept in the content.`,
        difficulty: 1
      });
    }
  }
  
  console.log(`Generated ${questions.length} dynamic content-based questions`);
  console.log('Questions generated:', questions.map(q => q.question));
  return questions;
}

// Function to generate quiz questions based on actual content
async function generateQuizQuestions(content: string, originalPrompt: string): Promise<QuizQuestion[]> {
  console.log('About to generate content-based quiz questions');
  
  // Generate content-specific quiz questions
  const contentBasedQuestions = generateContentBasedQuestions(content, originalPrompt);
  
  console.log('Generated quiz questions:', contentBasedQuestions);
  return contentBasedQuestions;
}

export async function POST(req: NextRequest) {
  const { prompt } = (await req.json()) as GenerateRequest;
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Empty prompt' }, { status: 400 });
  }

  try {
    const t5 = await getT5Pipeline();
    
    // Generate content
    const out = await t5(prompt, {
      max_new_tokens: 500, // Increased for much longer responses
      temperature: 0.8,    // Slightly higher for more creative responses
      do_sample: true,     // Enable sampling for better quality
      repetition_penalty: 1.1 // Reduce repetition
    });

    const generatedText = out[0].generated_text;
    
    // Generate related quiz questions
    console.log('About to generate quiz questions for prompt:', prompt);
    const quizQuestions = await generateQuizQuestions(generatedText, prompt);
    console.log('Generated quiz questions:', quizQuestions);

    const body: GenerateResponse = { 
      text: generatedText,
      quizQuestions: quizQuestions
    };
    
    console.log('Final API response body:', {
      textLength: body.text.length,
      quizQuestionsCount: body.quizQuestions?.length || 0,
      firstQuestion: body.quizQuestions?.[0]
    });
    return NextResponse.json(body);
  } catch (err) {
    console.error('Error in generate API:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}