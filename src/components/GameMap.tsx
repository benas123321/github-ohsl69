import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Landmark } from '../types';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface GameMapProps {
  landmarks: Landmark[];
  correctGuesses: string[];
  currentLandmark: string | null;
  wrongAttempts: number;
  language: 'en' | 'lt';
}

export function GameMap({ landmarks, correctGuesses, currentLandmark, wrongAttempts, language }: GameMapProps) {
  const getMarkerColor = (landmarkId: string) => {
    if (correctGuesses.includes(landmarkId)) return 'green';
    if (landmarkId === currentLandmark) {
      if (wrongAttempts === 0) return 'yellow';
      if (wrongAttempts === 1) return 'orange';
      return 'red';
    }
    return 'blue';
  };

  const createIcon = (color: string) => new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-[600px] rounded-lg shadow-md"
    >
      <TileLayer
        url={language === 'en' 
          ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          : "https://tile.openstreetmap.de/{z}/{x}/{y}.png"
        }
        attribution={language === 'en'
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> autoriai'
        }
      />
      {landmarks.map((landmark) => (
        <Marker
          key={landmark.id}
          position={[landmark.latitude, landmark.longitude]}
          icon={createIcon(getMarkerColor(landmark.id))}
        >
          <Popup>
            {correctGuesses.includes(landmark.id) ? (
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
  );
}