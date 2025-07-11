'use client';
import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, Star, Clock, Lightbulb } from 'lucide-react';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface Question {
  id: string;
  type: 'drag-drop' | 'multiple-choice' | 'fill-blank' | 'ranking' | 'matching';
  question: string;
  description?: string;
  answers: Answer[];
  correctAnswers?: string[];
  correctOrder?: string[];
  pairs?: { [key: string]: string };
  blanks?: string[];
}

const sampleQuestions: Question[] = [
  {
    id: 'q1',
    type: 'drag-drop',
    question: 'Arrange these programming concepts in order of learning difficulty (easiest to hardest):',
    answers: [
      { id: 'q1-a', text: 'Variables', isCorrect: true },
      { id: 'q1-b', text: 'Functions', isCorrect: true },
      { id: 'q1-c', text: 'Data Structures', isCorrect: true },
      { id: 'q1-d', text: 'Algorithms', isCorrect: true },
      { id: 'q1-e', text: 'System Design', isCorrect: true }
    ],
    correctOrder: ['Variables', 'Functions', 'Data Structures', 'Algorithms', 'System Design']
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: 'Which of the following is NOT a JavaScript data type?',
    answers: [
      { id: 'q2-a', text: 'String', isCorrect: false },
      { id: 'q2-b', text: 'Boolean', isCorrect: false },
      { id: 'q2-c', text: 'Float', isCorrect: true, explanation: 'JavaScript uses "Number" type for all numeric values' },
      { id: 'q2-d', text: 'Object', isCorrect: false }
    ]
  },
  {
    id: 'q3',
    type: 'matching',
    question: 'Match the programming languages with their primary use cases:',
    answers: [
      { id: 'q3-js', text: 'JavaScript', isCorrect: true },
      { id: 'q3-py', text: 'Python', isCorrect: true },
      { id: 'q3-c', text: 'C', isCorrect: true },
      { id: 'q3-web', text: 'Web Development', isCorrect: true },
      { id: 'q3-ai', text: 'AI/ML', isCorrect: true },
      { id: 'q3-sys', text: 'System Programming', isCorrect: true }
    ],
    pairs: {
      'JavaScript': 'Web Development',
      'Python': 'AI/ML',
      'C': 'System Programming'
    }
  }
];

interface InteractiveQuestionnaireProps {
  questions?: Question[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function InteractiveQuestionnaire({ questions, onComplete }: InteractiveQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState<{ [key: string]: number }>({});
  const [startTime, setStartTime] = useState(Date.now());

  const questionsToUse = questions || sampleQuestions;
  const currentQuestion = questionsToUse[currentQuestionIndex];

  // Initialize user answers for drag-drop questions
  const initializeDragDropAnswers = useCallback((question: Question) => {
    if (question.type === 'drag-drop' || question.type === 'ranking') {
      return {
        available: [...question.answers],
        selected: []
      };
    }
    return null;
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const currentAnswer = userAnswers[currentQuestion.id] || initializeDragDropAnswers(currentQuestion);

    if (!currentAnswer) return;

    const newAnswer = { ...currentAnswer };

    // Remove from source
    const sourceArray = [...newAnswer[source.droppableId]];
    const [removed] = sourceArray.splice(source.index, 1);

    // Add to destination
    const destArray = [...newAnswer[destination.droppableId]];
    destArray.splice(destination.index, 0, removed);

    newAnswer[source.droppableId] = sourceArray;
    newAnswer[destination.droppableId] = destArray;

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newAnswer
    }));
  }, [currentQuestion, userAnswers, initializeDragDropAnswers]);

  const handleMultipleChoice = useCallback((answerId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    
    setTimePerQuestion(prev => ({
      ...prev,
      [currentQuestion.id]: timeTaken
    }));

    if (currentQuestionIndex < questionsToUse.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStartTime(Date.now());
    } else {
      // Calculate final score
      let finalScore = 0;
      questionsToUse.forEach(question => {
        const userAnswer = userAnswers[question.id];
        if (isAnswerCorrect(question, userAnswer)) {
          finalScore++;
        }
      });
      
      setScore(finalScore);
      setShowResults(true);
      onComplete?.(finalScore, questionsToUse.length);
    }
  }, [currentQuestionIndex, questionsToUse, startTime, userAnswers, onComplete]);

  const isAnswerCorrect = useCallback((question: Question, userAnswer: any) => {
    switch (question.type) {
      case 'drag-drop':
      case 'ranking':
        if (!userAnswer?.selected) return false;
        const userOrder = userAnswer.selected.map((item: Answer) => item.text);
        return JSON.stringify(userOrder) === JSON.stringify(question.correctOrder);
      
      case 'multiple-choice':
        const correctAnswer = question.answers.find(a => a.isCorrect);
        return userAnswer === correctAnswer?.id;
      
      case 'matching':
        if (!userAnswer || !question.pairs) return false;
        // Check if all correct pairs are matched
        for (const [key, value] of Object.entries(question.pairs)) {
          if (userAnswer[key] !== value) {
            return false;
          }
        }
        return true;
      
      default:
        return false;
    }
  }, []);

  // Initialize matching answers
  const initializeMatchingAnswers = useCallback((question: Question) => {
    if (question.type === 'matching' && question.pairs) {
      const result: { [key: string]: string } = {};
      // Initialize all pairs as unmatched
      Object.keys(question.pairs).forEach(key => {
        result[key] = '';
      });
      return result;
    }
    return {};
  }, []);

  const handleMatchingDrop = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const sourceId = result.draggableId;
    const targetCategory = result.destination.droppableId;
    
    // Remove from any existing category
    const currentAnswer = userAnswers[currentQuestion.id] || initializeMatchingAnswers(currentQuestion);
    const newAnswer = { ...currentAnswer };
    
    // Clear previous assignment of this item
    Object.keys(newAnswer).forEach(key => {
      if (newAnswer[key] === sourceId) {
        newAnswer[key] = '';
      }
    });
    
    // Assign to new category
    if (targetCategory !== 'unmatched') {
      newAnswer[sourceId] = targetCategory;
    }

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newAnswer
    }));
  }, [currentQuestion, userAnswers, initializeMatchingAnswers]);

  const renderQuestion = () => {
    const userAnswer = userAnswers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'drag-drop':
      case 'ranking':
        const dragAnswer = userAnswer || initializeDragDropAnswers(currentQuestion);
        
        return (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {/* Available Options */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Available Options</h3>
                <Droppable droppableId="available" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[80px] flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver ? 'border-blue-400 bg-blue-100' : 'border-blue-300'
                      }`}
                    >
                      {dragAnswer?.available?.map((item: Answer, index: number) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`px-4 py-2 bg-white rounded-lg shadow-sm border cursor-move transition-all ${
                                snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                              }`}
                            >
                              {item.text}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Answer Area */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">Your Answer (in order)</h3>
                <Droppable droppableId="selected">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[80px] space-y-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver ? 'border-green-400 bg-green-100' : 'border-green-300'
                      }`}
                    >
                      {dragAnswer?.selected?.map((item: Answer, index: number) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`px-4 py-2 bg-white rounded-lg shadow-sm border cursor-move transition-all ${
                                snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                                {item.text}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => (
              <motion.button
                key={answer.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMultipleChoice(answer.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  userAnswer === answer.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswer === answer.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {userAnswer === answer.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-600">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-gray-800">{answer.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'matching':
        const matchingAnswer = userAnswers[currentQuestion.id] || initializeMatchingAnswers(currentQuestion);
        
        if (!currentQuestion.pairs) return <div>Invalid matching question structure</div>;
        
        const languages = Object.keys(currentQuestion.pairs);
        const useCases = [...new Set(Object.values(currentQuestion.pairs))];
        
        return (
          <DragDropContext onDragEnd={handleMatchingDrop}>
            <div className="space-y-6">
              {/* Programming Languages (Draggable Items) */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">Programming Languages</h3>
                <Droppable droppableId="unmatched" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[80px] flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver ? 'border-purple-400 bg-purple-100' : 'border-purple-300'
                      }`}
                    >
                      {languages.filter(lang => !matchingAnswer[lang]).map((language, index) => (
                        <Draggable key={`lang-${language}`} draggableId={language} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`px-4 py-2 bg-white rounded-lg shadow-sm border cursor-move transition-all ${
                                snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                              }`}
                            >
                              {language}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Use Cases (Drop Zones) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-3">Use Cases</h3>
                {useCases.map((useCase) => (
                  <div key={useCase} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">{useCase}</h4>
                    <Droppable droppableId={useCase}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[60px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                            snapshot.isDraggingOver 
                              ? 'border-green-400 bg-green-100' 
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {languages.filter(lang => matchingAnswer[lang] === useCase).map((language, index) => (
                            <Draggable key={`matched-${language}`} draggableId={language} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow-sm border border-green-300 cursor-move transition-all ${
                                    snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                                  }`}
                                >
                                  {language}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {languages.filter(lang => matchingAnswer[lang] === useCase).length === 0 && (
                            <div className="text-gray-400 text-sm">Drop a programming language here</div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </DragDropContext>
        );

      default:
        return <div>Question type not implemented</div>;
    }
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {score}/{questionsToUse.length}
            </div>
            <div className="text-lg">
              {Math.round((score / questionsToUse.length) * 100)}% Score
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Question Review</h3>
          {questionsToUse.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = isAnswerCorrect(question, userAnswer);
            
            return (
              <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800">Question {index + 1}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {Math.round((timePerQuestion[question.id] || 0) / 1000)}s
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{question.question}</p>
                {!isCorrect && (
                  <div className="text-red-600 text-sm">
                    <strong>Correct answer:</strong> {question.correctOrder?.join(', ') || 'See explanation'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setShowResults(false);
            setScore(0);
            setTimePerQuestion({});
            setStartTime(Date.now());
          }}
          className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questionsToUse.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questionsToUse.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questionsToUse.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Question {currentQuestionIndex + 1}</h2>
        </div>
        <p className="text-gray-700 mb-2">{currentQuestion.question}</p>
        {currentQuestion.description && (
          <p className="text-sm text-gray-500 mb-4">{currentQuestion.description}</p>
        )}
      </div>

      {/* Question Content */}
      <div className="mb-8">
        {renderQuestion()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="flex gap-2">
          {questionsToUse.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestionIndex
                  ? 'bg-blue-600'
                  : index < currentQuestionIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!userAnswers[currentQuestion.id]}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestionIndex === questionsToUse.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
} 