'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, CheckCircle, X, Clock, Star, Lightbulb, Target, RotateCcw, TestTube2, Atom, Play, TrendingUp } from 'lucide-react';

interface ScienceChallenge {
  id: string;
  type: 'hypothesis' | 'experiment' | 'observation' | 'conclusion' | 'method';
  category: string;
  question: string;
  scenario?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  hint?: string;
  experimentData?: {
    variables: string[];
    results: number[];
    labels: string[];
  };
}

const scienceChallenges: ScienceChallenge[] = [
  // Hypothesis Testing
  {
    id: '1',
    type: 'hypothesis',
    category: 'Scientific Method',
    question: 'A scientist wants to test if plants grow faster with classical music. What is the best hypothesis?',
    options: [
      'Plants like music',
      'Classical music will make plants grow faster than no music',
      'Music is good for plants',
      'Plants grow at different rates'
    ],
    correctAnswer: 'Classical music will make plants grow faster than no music',
    explanation: 'A good hypothesis must be testable, specific, and predict a relationship between variables.',
    difficulty: 2,
    hint: 'A hypothesis should be specific and testable'
  },
  {
    id: '2',
    type: 'experiment',
    category: 'Experimental Design',
    question: 'To test if fertilizer affects plant growth, what should be the control group?',
    scenario: 'You have 20 identical plants. You want to test if Brand X fertilizer makes them grow taller.',
    options: [
      'Plants with Brand X fertilizer',
      'Plants with no fertilizer',
      'Plants with different fertilizer',
      'Plants in different locations'
    ],
    correctAnswer: 'Plants with no fertilizer',
    explanation: 'The control group should be identical to the experimental group except for the variable being tested.',
    difficulty: 2,
    hint: 'The control group should differ only in the variable being tested'
  },
  {
    id: '3',
    type: 'observation',
    category: 'Data Analysis',
    question: 'Based on this data, what can you observe about plant height?',
    experimentData: {
      variables: ['Day 1', 'Day 7', 'Day 14', 'Day 21'],
      results: [2, 4, 7, 12],
      labels: ['Height (cm)']
    },
    options: [
      'Plant height decreases over time',
      'Plant height increases over time',
      'Plant height stays the same',
      'The data is incomplete'
    ],
    correctAnswer: 'Plant height increases over time',
    explanation: 'The data shows consistent growth from 2cm to 12cm over 21 days.',
    difficulty: 1,
    hint: 'Look at the pattern of numbers from day 1 to day 21'
  },
  {
    id: '4',
    type: 'conclusion',
    category: 'Scientific Reasoning',
    question: 'After testing 100 seeds, 85 sprouted with fertilizer and 60 sprouted without. What conclusion is most valid?',
    options: [
      'Fertilizer definitely makes all seeds sprout',
      'Fertilizer appears to increase sprouting rate',
      'Fertilizer has no effect on seeds',
      'More testing is needed with different plants'
    ],
    correctAnswer: 'Fertilizer appears to increase sprouting rate',
    explanation: 'The data suggests a correlation, but we should be cautious about claiming absolute causation from one experiment.',
    difficulty: 3,
    hint: 'Be careful not to overstate conclusions from limited data'
  },
  {
    id: '5',
    type: 'method',
    category: 'Scientific Process',
    question: 'What is the correct order of the scientific method?',
    options: [
      'Hypothesis → Observation → Experiment → Conclusion',
      'Observation → Hypothesis → Experiment → Conclusion',
      'Experiment → Hypothesis → Observation → Conclusion',
      'Conclusion → Hypothesis → Experiment → Observation'
    ],
    correctAnswer: 'Observation → Hypothesis → Experiment → Conclusion',
    explanation: 'Scientists first observe, form a hypothesis, test it through experiments, then draw conclusions.',
    difficulty: 2,
    hint: 'Think about how scientists naturally discover things'
  },
  {
    id: '6',
    type: 'experiment',
    category: 'Variables',
    question: 'In testing how temperature affects ice melting, what is the independent variable?',
    scenario: 'Ice cubes are placed in rooms at different temperatures: 10°C, 20°C, 30°C, and 40°C.',
    options: [
      'Time taken to melt',
      'Size of ice cubes',
      'Temperature of the room',
      'Amount of water produced'
    ],
    correctAnswer: 'Temperature of the room',
    explanation: 'The independent variable is what the scientist changes or controls in the experiment.',
    difficulty: 2,
    hint: 'The independent variable is what you change on purpose'
  },
  {
    id: '7',
    type: 'observation',
    category: 'Data Interpretation',
    question: 'A ball is dropped from different heights. What pattern do you observe?',
    experimentData: {
      variables: ['1m', '2m', '3m', '4m'],
      results: [1.4, 2.0, 2.4, 2.8],
      labels: ['Time to fall (seconds)']
    },
    options: [
      'Higher drops take more time',
      'Higher drops take less time',
      'All drops take the same time',
      'The pattern is random'
    ],
    correctAnswer: 'Higher drops take more time',
    explanation: 'As drop height increases from 1m to 4m, the time increases from 1.4 to 2.8 seconds.',
    difficulty: 1,
    hint: 'Compare the height values with the time values'
  },
  {
    id: '8',
    type: 'hypothesis',
    category: 'Prediction',
    question: 'If you hypothesize that "sugar dissolves faster in hot water," what would you predict?',
    options: [
      'Sugar will not dissolve in cold water',
      'Hot water will dissolve sugar more quickly than cold water',
      'Sugar tastes better in hot water',
      'All water temperatures work the same'
    ],
    correctAnswer: 'Hot water will dissolve sugar more quickly than cold water',
    explanation: 'A prediction is a specific, testable statement that follows from your hypothesis.',
    difficulty: 1,
    hint: 'A prediction should directly follow from the hypothesis'
  },
  {
    id: '9',
    type: 'conclusion',
    category: 'Critical Thinking',
    question: 'A study shows that students who eat breakfast score higher on tests. What is the most reasonable conclusion?',
    options: [
      'Eating breakfast causes better test scores',
      'There may be a relationship between breakfast and test performance',
      'Students should always eat breakfast',
      'Breakfast is the only factor affecting test scores'
    ],
    correctAnswer: 'There may be a relationship between breakfast and test performance',
    explanation: 'Correlation does not prove causation. Other factors might explain both breakfast eating and test performance.',
    difficulty: 3,
    hint: 'Remember that correlation does not equal causation'
  },
  {
    id: '10',
    type: 'method',
    category: 'Research Design',
    question: 'Why is it important to repeat experiments multiple times?',
    options: [
      'To make the experiment longer',
      'To reduce errors and increase reliability',
      'To use more materials',
      'To make the data more complicated'
    ],
    correctAnswer: 'To reduce errors and increase reliability',
    explanation: 'Repeating experiments helps identify and reduce random errors, making results more reliable.',
    difficulty: 2,
    hint: 'Think about why scientists need to be sure of their results'
  }
];

export default function ScienceReasoning() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
  const [gameActive, setGameActive] = useState(false);
  const [answeredChallenges, setAnsweredChallenges] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [challengesOrder, setChallengesOrder] = useState<number[]>([]);
  const [showData, setShowData] = useState(false);

  const challenge = scienceChallenges[challengesOrder[currentChallenge] || 0];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    const shuffled = [...Array(scienceChallenges.length).keys()].sort(() => Math.random() - 0.5);
    setChallengesOrder(shuffled);
    setGameActive(true);
    setTimeLeft(480);
    setScore(0);
    setCurrentChallenge(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredChallenges([]);
    setCorrectAnswers([]);
    setShowHint(false);
    setShowData(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (answeredChallenges.includes(currentChallenge)) return;

    setSelectedAnswer(answer);
    setAnsweredChallenges([...answeredChallenges, currentChallenge]);
    
    const isCorrect = answer === challenge.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentChallenge]);
      setScore(score + challenge.difficulty * 25);
    }
    
    setShowExplanation(true);
  };

  const nextChallenge = () => {
    if (currentChallenge < challengesOrder.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setShowData(false);
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
      case 'hypothesis': return 'bg-blue-500';
      case 'experiment': return 'bg-green-500';
      case 'observation': return 'bg-purple-500';
      case 'conclusion': return 'bg-orange-500';
      case 'method': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderDataVisualization = () => {
    if (!challenge.experimentData) return null;

    const { variables, results, labels } = challenge.experimentData;
    const maxResult = Math.max(...results);

    return (
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Experimental Data
        </h4>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-end gap-4 h-40 mb-4">
            {results.map((result, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(result / maxResult) * 120}px` }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-gradient-to-t from-blue-500 to-blue-300 w-full rounded-t-lg mb-2 min-h-[20px]"
                />
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">{variables[index]}</div>
                  <div className="text-xs text-gray-500">{result}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            {labels[0]}
          </div>
        </div>
      </div>
    );
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl mb-6"
                whileHover={{ scale: 1.05 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Microscope className="h-10 w-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Science Reasoning
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Master the scientific method through hypothesis testing, experiment design, and data analysis!
              </p>

              {answeredChallenges.length > 0 && (
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Scientific Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-600">{score}</div>
                      <div className="text-gray-600">Final Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{correctAnswers.length}</div>
                      <div className="text-gray-600">Correct</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
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
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="h-6 w-6" />
              {answeredChallenges.length > 0 ? 'Test Again' : 'Start Experiment'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-xl">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Science Reasoning</h1>
                <p className="text-gray-600">Challenge {currentChallenge + 1} of {challengesOrder.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-green-600">{formatTime(timeLeft)}</span>
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
              className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full"
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TestTube2 className="h-4 w-4" />
              <span className="capitalize">{challenge.type}</span>
            </div>
          </div>

          {/* Scenario */}
          {challenge.scenario && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Atom className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Scenario:</h4>
                  <p className="text-blue-700">{challenge.scenario}</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Visualization */}
          {challenge.experimentData && (
            <div className="mb-6">
              {renderDataVisualization()}
            </div>
          )}

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{challenge.question}</h2>

          {/* Multiple Choice Options */}
          {challenge.options && (
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
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
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
              Show Scientific Hint
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
                    <h4 className="font-semibold text-yellow-800 mb-1">Scientific Hint:</h4>
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
                      {correctAnswers.includes(currentChallenge) ? 'Scientifically Correct!' : 'Needs More Research'}
                    </h4>
                    <p className={`mb-4 ${
                      correctAnswers.includes(currentChallenge) ? 'text-green-700' : 'text-red-700'
                    }`}>
                      The correct answer is: <strong>{challenge.correctAnswer}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <TestTube2 className="h-4 w-4" />
                    Scientific Explanation:
                  </h5>
                  <p className="text-gray-700">{challenge.explanation}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextChallenge}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg"
                >
                  {currentChallenge < challengesOrder.length - 1 ? 'Next Experiment' : 'Complete Study'}
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
              Restart Experiment
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
} 