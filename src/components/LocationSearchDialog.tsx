import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { getGeoData } from '../services/geocoding';
import { GeocodingResult } from '../types';
import { LocationSelector } from './LocationSelector';

interface LocationSearchDialogProps {
  onClose: () => void;
  onSelect: (location: { lat: number; lon: number }) => void;
  initialSearch?: string;
  language: 'en' | 'lt';
}

export function LocationSearchDialog({ onClose, onSelect, initialSearch = '', language }: LocationSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [locations, setLocations] = useState<GeocodingResult[]>([]);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const [showManual, setShowManual] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const results = await getGeoData(searchTerm);
      if (results) {
        setLocations(results);
      }
    }
  };

  const handleManualSubmit = () => {
    const lat = parseFloat(manualCoords.lat);
    const lon = parseFloat(manualCoords.lng);
    if (!isNaN(lat) && !isNaN(lon)) {
      onSelect({ lat, lon });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {language === 'en' ? 'Search Location' : 'Ieškoti vietos'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={language === 'en' ? 'Search for a location...' : 'Ieškoti vietos...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowManual(!showManual)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {language === 'en' ? 'Enter coordinates manually' : 'Įvesti koordinates rankiniu būdu'}
          </button>

          {showManual && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Latitude' : 'Platuma'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualCoords.lat}
                    onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Longitude' : 'Ilguma'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualCoords.lng}
                    onChange={(e) => setManualCoords({ ...manualCoords, lng: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleManualSubmit}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {language === 'en' ? 'Use These Coordinates' : 'Naudoti šias koordinates'}
              </button>
            </div>
          )}

          {locations.length > 0 && (
            <LocationSelector
              locations={locations}
              onSelect={onSelect}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}