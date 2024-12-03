import React, { useState, useEffect } from 'react';
import { LandmarkForm } from './components/LandmarkForm';
import { Game } from './components/Game';
import { LanguageToggle } from './components/LanguageToggle';
import { Landmark } from './types';
import { Share2, Trophy } from 'lucide-react';

function App() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [language, setLanguage] = useState<'en' | 'lt'>('en');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        setLandmarks(decodedData);
        setIsPlaying(true);
      } catch (error) {
        console.error('Error loading shared data:', error);
      }
    }
  }, []);

  const handleAddLandmark = (landmark: Landmark) => {
    setLandmarks((prev) => [...prev, landmark]);
  };

  const handleShare = () => {
    const gameData = btoa(JSON.stringify(landmarks));
    const shareUrl = `${window.location.origin}?data=${gameData}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'lt' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Landmark Memory Game' : 'Orientyrų Atminties Žaidimas'}
          </h1>
          <LanguageToggle language={language} onToggle={toggleLanguage} />
        </div>

        <p className="text-gray-600">
          {language === 'en' 
            ? 'Add landmarks and test your geography knowledge!'
            : 'Pridėkite orientyrus ir išbandykite savo geografijos žinias!'}
        </p>

        {!isPlaying && !gameCompleted && (
          <div className="space-y-6">
            <LandmarkForm onAddLandmark={handleAddLandmark} />
            
            {landmarks.length > 0 && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {language === 'en' ? 'Start Game' : 'Pradėti Žaidimą'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Share Map' : 'Dalintis Žemėlapiu'}
                </button>
              </div>
            )}
          </div>
        )}

        {isPlaying && !gameCompleted && (
          <Game 
            landmarks={landmarks} 
            onGameComplete={handleGameComplete}
            language={language}
          />
        )}

        {gameCompleted && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'en' 
                ? 'Congratulations! You\'ve completed the game!'
                : 'Sveikiname! Jūs baigėte žaidimą!'}
            </h2>
            <button
              onClick={() => {
                setIsPlaying(false);
                setGameCompleted(false);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {language === 'en' ? 'Play Again' : 'Žaisti Dar Kartą'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;