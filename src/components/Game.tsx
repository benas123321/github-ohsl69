import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Landmark } from '../types';
import { ProgressBar } from './ProgressBar';

interface GameProps {
  landmarks: Landmark[];
  onGameComplete: (score: number) => void;
  language: 'en' | 'lt';
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function Game({ landmarks, onGameComplete, language }: GameProps) {
  const [gameState, setGameState] = useState({
    currentLandmarkIndex: 0,
    correctGuesses: new Set<string>(),
    attempts: 0,
    score: 0
  });

  const currentLandmark = landmarks[gameState.currentLandmarkIndex];
  const isGameComplete = gameState.currentLandmarkIndex >= landmarks.length;

  const getMarkerColor = (landmarkId: string) => {
    if (gameState.correctGuesses.has(landmarkId)) return 'green';
    if (landmarkId === currentLandmark?.id) {
      if (gameState.attempts === 0) return 'yellow';
      if (gameState.attempts === 1) return 'orange';
      return 'red';
    }
    return 'blue';
  };

  const createIcon = (color: string) => new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const handleMarkerClick = (landmark: Landmark) => {
    if (isGameComplete || !currentLandmark) return;

    if (landmark.id === currentLandmark.id) {
      // Correct guess
      setGameState(prev => ({
        ...prev,
        correctGuesses: new Set([...prev.correctGuesses, landmark.id]),
        currentLandmarkIndex: prev.currentLandmarkIndex + 1,
        attempts: 0,
        score: prev.score + Math.max(3 - prev.attempts, 1)
      }));
    } else {
      // Wrong guess
      setGameState(prev => ({
        ...prev,
        attempts: prev.attempts + 1
      }));
    }
  };

  useEffect(() => {
    if (isGameComplete) {
      onGameComplete(gameState.score);
    }
  }, [isGameComplete, gameState.score, onGameComplete]);

  const mapCenter: [number, number] = currentLandmark
    ? [currentLandmark.latitude, currentLandmark.longitude]
    : [20, 0];

  const mapZoom = currentLandmark ? 5 : 2;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {language === 'en' ? 'Score:' : 'Taškai:'} {gameState.score}
          </h2>
          <div className="text-gray-600">
            {language === 'en' ? 'Find:' : 'Rasti:'} {currentLandmark ? (
              <span className="font-medium">
                {language === 'en' ? currentLandmark.name : (currentLandmark.nameLt || currentLandmark.name)}
                {currentLandmark.type !== 'other' && ` (${currentLandmark.type})`}
              </span>
            ) : '---'}
          </div>
        </div>
        
        <ProgressBar 
          total={landmarks.length} 
          completed={gameState.correctGuesses.size} 
        />
      </div>

      <div className="w-full h-[600px] rounded-lg shadow-md overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {landmarks.map((landmark) => (
            <Marker
              key={landmark.id}
              position={[landmark.latitude, landmark.longitude]}
              icon={createIcon(getMarkerColor(landmark.id))}
              eventHandlers={{
                click: () => handleMarkerClick(landmark)
              }}
            >
              <Popup>
                {gameState.correctGuesses.has(landmark.id) ? (
                  <span className="text-green-600 font-medium">
                    {language === 'en' ? landmark.name : (landmark.nameLt || landmark.name)}
                  </span>
                ) : (
                  <span>???</span>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}