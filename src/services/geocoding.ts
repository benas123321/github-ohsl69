import axios from 'axios';
import { GeocodingResult } from '../types';

export async function getGeoData(placeName: string): Promise<GeocodingResult[] | null> {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=5`
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