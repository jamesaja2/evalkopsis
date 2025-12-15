import { QuizQuestion } from '../types';

export const validateAnswer = (question: QuizQuestion, userAnswer: string): boolean => {
  const normalizedAnswer = userAnswer.toLowerCase().trim();

  if (question.type === 'text') {
    const correctAnswers = Array.isArray(question.answer)
      ? question.answer
      : [question.answer];

    return correctAnswers.some(
      answer => answer.toLowerCase().trim() === normalizedAnswer
    );
  }

  if (question.type === 'choice') {
    return normalizedAnswer === (question.answer as string).toLowerCase().trim();
  }

  return false;
};

export const validateImageSelection = (
  selectedAreas: string[],
  correctAreas: string[]
): boolean => {
  const sortedSelected = [...selectedAreas].sort().join(',');
  const sortedCorrect = [...correctAreas].sort().join(',');
  return sortedSelected === sortedCorrect;
};
