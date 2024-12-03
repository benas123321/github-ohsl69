export interface Landmark {
  id: string;
  name: string;
  nameLt?: string;
  type: LandmarkType;
  latitude: number;
  longitude: number;
  country?: string;
}

export type LandmarkType = 
  | 'city' 
  | 'lake' 
  | 'mountain' 
  | 'mountain_range'
  | 'island' 
  | 'sea'
  | 'river'
  | 'plain'
  | 'plateau'
  | 'lowland'
  | 'bay'
  | 'gulf'
  | 'strait'
  | 'other';

export interface GameState {
  landmarks: Landmark[];
  correctGuesses: string[];
  currentLandmark: string | null;
  score: number;
  attempts: number;
  wrongGuesses: Set<string>;
}

export interface GeocodingResult {
  lat: number;
  lon: number;
  type?: string;
  importance?: number;
}