'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, X, Clock, Star, Lightbulb, Target, RotateCcw, Type, Shuffle, Play } from 'lucide-react';

interface EnglishChallenge {
  id: string;
  type: 'grammar' | 'vocabulary' | 'sentence-building' | 'word-logic' | 'comprehension';
  category: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  hint?: string;
  words?: string[];
  sentence?: string;
}

const englishChallenges: EnglishChallenge[] = [
  // Grammar Challenges
  {
    id: '1',
    type: 'grammar',
    category: 'Subject-Verb Agreement',
    question: 'Choose the correct verb form: "The team of players _____ practicing hard."',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 'is',
    explanation: 'When the subject is a collective noun like "team," the verb should be singular, so "is" is correct.',
    difficulty: 2,
    hint: 'Focus on whether "team" is treated as singular or plural'
  },
  {
    id: '2',
    type: 'vocabulary',
    category: 'Synonyms',
    question: 'Which word is closest in meaning to "meticulous"?',
    options: ['Careless', 'Careful', 'Quick', 'Loud'],
    correctAnswer: 'Careful',
    explanation: 'Meticulous means showing great attention to detail; being very careful and precise.',
    difficulty: 2,
    hint: 'Think about someone who pays attention to every small detail'
  },
  {
    id: '3',
    type: 'sentence-building',
    category: 'Sentence Structure',
    question: 'Arrange these words to form a grammatically correct sentence:',
    words: ['quickly', 'the', 'cat', 'ran', 'away'],
    correctAnswer: ['The', 'cat', 'ran', 'away', 'quickly'],
    explanation: 'The correct order follows Subject-Verb-Adverb pattern: "The cat ran away quickly."',
    difficulty: 1,
    hint: 'Start with the article and subject, then add the verb and modifiers'
  },
  {
    id: '4',
    type: 'word-logic',
    category: 'Word Relationships',
    question: 'Complete the analogy: Book is to Reading as Fork is to ______',
    options: ['Kitchen', 'Eating', 'Metal', 'Spoon'],
    correctAnswer: 'Eating',
    explanation: 'A book is used for reading, just as a fork is used for eating. The relationship is tool-to-function.',
    difficulty: 2,
    hint: 'Think about what you do with each object'
  },
  {
    id: '5',
    type: 'comprehension',
    category: 'Reading Logic',
    question: 'If "All roses are flowers" and "Some flowers are red," which conclusion is logically valid?',
    options: [
      'All roses are red',
      'Some roses might be red',
      'No roses are red',
      'All red things are roses'
    ],
    correctAnswer: 'Some roses might be red',
    explanation: 'Since roses are flowers and some flowers are red, it\'s possible (but not certain) that some roses are red.',
    difficulty: 3,
    hint: 'Be careful not to assume more than what is stated'
  },
  {
    id: '6',
    type: 'grammar',
    category: 'Punctuation',
    question: 'Which sentence is punctuated correctly?',
    options: [
      'The dog, who was barking ran away.',
      'The dog who was barking, ran away.',
      'The dog, who was barking, ran away.',
      'The dog who was barking ran away.'
    ],
    correctAnswer: 'The dog, who was barking, ran away.',
    explanation: 'Non-restrictive clauses (giving additional info) should be set off with commas on both sides.',
    difficulty: 3,
    hint: 'Consider whether the clause is essential to identify the subject'
  },
  {
    id: '7',
    type: 'vocabulary',
    category: 'Context Clues',
    question: 'In "The verbose speaker droned on for hours," what does "verbose" likely mean?',
    options: ['Quiet', 'Using too many words', 'Angry', 'Confused'],
    correctAnswer: 'Using too many words',
    explanation: 'The context "droned on for hours" suggests someone who talks too much, which matches "verbose."',
    difficulty: 2,
    hint: 'Use the context of talking for hours to understand the meaning'
  },
  {
    id: '8',
    type: 'sentence-building',
    category: 'Complex Sentences',
    question: 'Combine these into a complex sentence using "although":',
    words: ['it', 'was', 'raining', 'we', 'went', 'hiking'],
    correctAnswer: ['Although', 'it', 'was', 'raining', 'we', 'went', 'hiking'],
    explanation: 'A complex sentence with "although" shows contrast: "Although it was raining, we went hiking."',
    difficulty: 2,
    hint: 'Start with "although" to show the contrasting relationship'
  },
  {
    id: '9',
    type: 'word-logic',
    category: 'Word Patterns',
    question: 'What comes next in this word pattern: CAT, DOG, ELEPHANT, ?',
    options: ['MOUSE', 'TIGER', 'HIPPOPOTAMUS', 'BIRD'],
    correctAnswer: 'HIPPOPOTAMUS',
    explanation: 'The pattern is increasing letter count: CAT(3), DOG(3), ELEPHANT(8), HIPPOPOTAMUS(12).',
    difficulty: 3,
    hint: 'Count the letters in each word'
  },
  {
    id: '10',
    type: 'comprehension',
    category: 'Logical Reasoning',
    question: 'All students who study hard pass the test. John passed the test. What can we conclude?',
    options: [
      'John studied hard',
      'John might have studied hard',
      'John did not study hard',
      'We cannot determine if John studied hard'
    ],
    correctAnswer: 'We cannot determine if John studied hard',
    explanation: 'The statement only tells us that studying hard guarantees passing, not that it\'s the only way to pass.',
    difficulty: 3,
    hint: 'Be careful about assuming the reverse of a conditional statement'
  }
];

export default function EnglishLogic() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes
  const [gameActive, setGameActive] = useState(false);
  const [answeredChallenges, setAnsweredChallenges] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [challengesOrder, setChallengesOrder] = useState<number[]>([]);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  const challenge = englishChallenges[challengesOrder[currentChallenge] || 0];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  useEffect(() => {
    if (challenge?.words) {
      setAvailableWords([...challenge.words].sort(() => Math.random() - 0.5));
      setBuiltSentence([]);
    }
  }, [challenge]);

  const startGame = () => {
    const shuffled = [...Array(englishChallenges.length).keys()].sort(() => Math.random() - 0.5);
    setChallengesOrder(shuffled);
    setGameActive(true);
    setTimeLeft(420);
    setScore(0);
    setCurrentChallenge(0);
    setSelectedAnswer(null);
    setBuiltSentence([]);
    setAvailableWords([]);
    setShowExplanation(false);
    setAnsweredChallenges([]);
    setCorrectAnswers([]);
    setShowHint(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (answeredChallenges.includes(currentChallenge)) return;

    setSelectedAnswer(answer);
    setAnsweredChallenges([...answeredChallenges, currentChallenge]);
    
    const isCorrect = answer === challenge.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + challenge.difficulty * 20);
    }
    
    setShowExplanation(true);
  };

  const handleWordClick = (word: string, fromBuilt: boolean = false) => {
    if (answeredChallenges.includes(currentChallenge)) return;

    if (fromBuilt) {
      // Remove from built sentence and add back to available
      setBuiltSentence(builtSentence.filter(w => w !== word));
      setAvailableWords([...availableWords, word]);
    } else {
      // Add to built sentence and remove from available
      setBuiltSentence([...builtSentence, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
    }
  };

  const checkSentenceAnswer = () => {
    if (answeredChallenges.includes(currentChallenge) || builtSentence.length === 0) return;

    setAnsweredChallenges([...answeredChallenges, currentChallenge]);
    
    const userSentence = builtSentence.join(' ').toLowerCase();
    const correctSentence = Array.isArray(challenge.correctAnswer) 
      ? challenge.correctAnswer.join(' ').toLowerCase()
      : challenge.correctAnswer.toLowerCase();
    
    const isCorrect = userSentence === correctSentence;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + challenge.difficulty * 20);
    }
    
    setShowExplanation(true);
  };

  const nextChallenge = () => {
    if (currentChallenge < challengesOrder.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedAnswer(null);
      setBuiltSentence([]);
      setAvailableWords([]);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      setGameActive(false);
    }
  };

  const restartGame = () => {
    startGame();
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-blue-500';
      case 'vocabulary': return 'bg-purple-500';
      case 'sentence-building': return 'bg-green-500';
      case 'word-logic': return 'bg-orange-500';
      case 'comprehension': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shuffleAvailableWords = () => {
    setAvailableWords([...availableWords].sort(() => Math.random() - 0.5));
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl mb-6"
                whileHover={{ scale: 1.05 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="h-10 w-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                English Logic
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Master language through grammar puzzles, vocabulary challenges, and logical reasoning!
              </p>

              {answeredChallenges.length > 0 && (
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Game Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{score}</div>
                      <div className="text-gray-600">Final Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">{correctAnswers.length}</div>
                      <div className="text-gray-600">Correct</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {((correctAnswers.length / answeredChallenges.length) * 100).toFixed(0)}%
                      </div>
                      <div className="text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="h-6 w-6" />
              {answeredChallenges.length > 0 ? 'Play Again' : 'Start Challenge'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">English Logic</h1>
                <p className="text-gray-600">Question {currentChallenge + 1} of {challengesOrder.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-purple-600">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-800">{score}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentChallenge + 1) / challengesOrder.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Challenge Content */}
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Challenge Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              Level {challenge.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(challenge.type)}`}>
              {challenge.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{challenge.question}</h2>

          {/* Sentence Building Interface */}
          {challenge.type === 'sentence-building' && challenge.words && (
            <div className="mb-6">
              {/* Built Sentence Area */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-[100px]">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Your Sentence:</h4>
                <div className="flex flex-wrap gap-2 min-h-[50px] items-center">
                  {builtSentence.length === 0 ? (
                    <span className="text-gray-400 italic">Click words below to build your sentence...</span>
                  ) : (
                    builtSentence.map((word, index) => (
                      <motion.button
                        key={`${word}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWordClick(word, true)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors font-medium"
                      >
                        {word}
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Available Words */}
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">Available Words:</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shuffleAvailableWords}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300 transition-colors"
                  >
                    <Shuffle className="h-4 w-4" />
                    Shuffle
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableWords.map((word, index) => (
                    <motion.button
                      key={`${word}-available-${index}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWordClick(word)}
                      className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                      {word}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button for Sentence Building */}
              {builtSentence.length > 0 && !answeredChallenges.includes(currentChallenge) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkSentenceAnswer}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  <CheckCircle className="h-5 w-5" />
                  Submit Sentence
                </motion.button>
              )}
            </div>
          )}

          {/* Multiple Choice Options */}
          {challenge.options && challenge.type !== 'sentence-building' && (
            <div className="grid grid-cols-1 gap-4 mb-6">
              {challenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answeredChallenges.includes(currentChallenge)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedAnswer === option
                      ? correctAnswers.includes(currentChallenge)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Hint Button */}
          {challenge.hint && !showHint && !showExplanation && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg mb-6 hover:bg-yellow-200 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Show Hint
            </motion.button>
          )}

          {/* Hint Display */}
          <AnimatePresence>
            {showHint && challenge.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Hint:</h4>
                    <p className="text-yellow-700">{challenge.hint}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`border rounded-xl p-6 mb-6 ${
                  correctAnswers.includes(currentChallenge)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {correctAnswers.includes(currentChallenge) ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : (
                    <X className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-bold text-lg mb-2 ${
                      correctAnswers.includes(currentChallenge) ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {correctAnswers.includes(currentChallenge) ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className={`mb-4 ${
                      correctAnswers.includes(currentChallenge) ? 'text-green-700' : 'text-red-700'
                    }`}>
                      The correct answer is: <strong>
                        {Array.isArray(challenge.correctAnswer) 
                          ? challenge.correctAnswer.join(' ')
                          : challenge.correctAnswer}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Explanation:</h5>
                  <p className="text-gray-700">{challenge.explanation}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextChallenge}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  {currentChallenge < challengesOrder.length - 1 ? 'Next Challenge' : 'Finish Game'}
                  {currentChallenge < challengesOrder.length - 1 && <Target className="h-5 w-5" />}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        {gameActive && (
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              Restart
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
} 