import React from 'react';
import { Trophy } from 'lucide-react';

interface GameCompletionProps {
  score: number;
  totalScore: number;
  onPlayAgain: () => void;
  language: 'en' | 'lt';
}

export function GameCompletion({ score, totalScore, onPlayAgain, language }: GameCompletionProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Trophy className="w-16 h-16 text-yellow-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        {language === 'en' 
          ? 'Congratulations! You\'ve completed the game!'
          : 'Sveikiname! Jūs baigėte žaidimą!'}
      </h2>
      <div className="text-lg">
        <p className="font-medium">
          {language === 'en' ? 'Final Score:' : 'Galutinis rezultatas:'} {score}/{totalScore}
        </p>
        <p className="text-gray-600 mt-2">
          {language === 'en'
            ? `You've achieved ${Math.round((score / totalScore) * 100)}% accuracy!`
            : `Jūs pasiekėte ${Math.round((score / totalScore) * 100)}% tikslumą!`}
        </p>
      </div>
      <button
        onClick={onPlayAgain}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {language === 'en' ? 'Play Again' : 'Žaisti Dar Kartą'}
      </button>
    </div>
  );
}