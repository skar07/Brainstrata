'use client';
import LogicQuestions from './LogicQuestions';

// Simple wrapper component that uses LogicQuestions
// This resolves the missing BlocklyLogicQuiz references without canvas dependency
export default function BlocklyLogicQuiz() {
  return <LogicQuestions />;
} 