import axios from 'axios';
import { GeocodingResult, LandmarkType } from '../types';

const LANDMARK_TYPE_KEYWORDS: Record<string, string[]> = {
  'sea': ['sea', 'ocean', 'jūra'],
  'lake': ['lake', 'ežeras'],
  'mountain': ['mountain', 'peak', 'kalnas'],
  'mountain_range': ['range', 'mountains', 'kalnai'],
  'island': ['island', 'sala'],
  'river': ['river', 'upė'],
  'plain': ['plain', 'lyguma'],
  'plateau': ['plateau', 'plynaukštė'],
  'lowland': ['lowland', 'žemuma'],
  'bay': ['bay', 'įlanka'],
  'gulf': ['gulf', 'įlanka'],
  'strait': ['strait', 'sąsiauris']
};

export async function getGeoData(placeName: string, type?: string): Promise<GeocodingResult[] | null> {
  try {
    // Add type-specific keywords to the search query
    let searchQuery = placeName;
    if (type && LANDMARK_TYPE_KEYWORDS[type]) {
      const keywords = LANDMARK_TYPE_KEYWORDS[type];
      if (!keywords.some(keyword => placeName.toLowerCase().includes(keyword.toLowerCase()))) {
        searchQuery = `${placeName} ${keywords[0]}`;
      }
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
    );
    
    if (response.data && response.data.length > 0) {
      return response.data
        .map((item: any) => ({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type,
          importance: parseFloat(item.importance),
          displayName: item.display_name
        }))
        .filter((result: GeocodingResult) => {
          if (!type) return true;
          
          const keywords = LANDMARK_TYPE_KEYWORDS[type] || [];
          return keywords.some(keyword => 
            result.displayName?.toLowerCase().includes(keyword.toLowerCase()) ||
            searchQuery.toLowerCase().includes(keyword.toLowerCase())
          );
        })
        .sort((a: GeocodingResult, b: GeocodingResult) => 
          (b.importance || 0) - (a.importance || 0)
        );
    }
    return null;
  } catch (error) {
    console.error('Error fetching geo data:', error);
    return null;
  }
}