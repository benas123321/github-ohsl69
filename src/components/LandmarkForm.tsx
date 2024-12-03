import React, { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Landmark, LandmarkType } from '../types';
import { getGeoData } from '../services/geocoding';
import { LocationSearchDialog } from './LocationSearchDialog';
import { FileImportDialog } from './FileImportDialog';
import { Upload } from 'lucide-react';

interface LandmarkFormProps {
  onAddLandmark: (landmark: Landmark) => void;
  language: 'en' | 'lt';
}

export function LandmarkForm({ onAddLandmark, language }: LandmarkFormProps) {
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showFileImport, setShowFileImport] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameLt: '',
    type: '' as LandmarkType | '',
    latitude: '',
    longitude: '',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      const results = await getGeoData(formData.name);
      if (results && results.length > 0) {
        if (results.length === 1) {
          handleLocationSelect(results[0]);
        } else {
          setShowLocationSearch(true);
        }
      } else {
        setShowLocationSearch(true);
      }
      return;
    }

    const landmark: Landmark = {
      id: nanoid(),
      name: formData.name,
      nameLt: formData.nameLt || undefined,
      type: formData.type || 'other',
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      country: formData.country || undefined
    };

    onAddLandmark(landmark);
    setFormData({
      name: '',
      nameLt: '',
      type: '',
      latitude: '',
      longitude: '',
      country: ''
    });
  };

  const handleLocationSelect = (location: { lat: number; lon: number }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.lat.toString(),
      longitude: location.lon.toString()
    }));
    setShowLocationSearch(false);
  };

  const handleFileImport = (data: any[]) => {
    data.forEach(item => {
      if (item.name) {
        const landmark: Landmark = {
          id: nanoid(),
          name: item.name,
          nameLt: item.nameLt,
          type: item.type || 'other',
          latitude: item.latitude,
          longitude: item.longitude,
          country: item.country
        };
        onAddLandmark(landmark);
      }
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Name (English)' : 'Pavadinimas (Anglų)'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Name (Lithuanian)' : 'Pavadinimas (Lietuvių)'}
            </label>
            <input
              type="text"
              value={formData.nameLt}
              onChange={(e) => setFormData({ ...formData, nameLt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Type (Optional)' : 'Tipas (Neprivaloma)'}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as LandmarkType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Any type</option>
              <option value="city">City</option>
              <option value="lake">Lake</option>
              <option value="mountain">Mountain</option>
              <option value="mountain_range">Mountain Range</option>
              <option value="island">Island</option>
              <option value="sea">Sea</option>
              <option value="river">River</option>
              <option value="plain">Plain</option>
              <option value="plateau">Plateau</option>
              <option value="lowland">Lowland</option>
              <option value="bay">Bay</option>
              <option value="gulf">Gulf</option>
              <option value="strait">Strait</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {language === 'en' ? 'Country' : 'Šalis'}
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {language === 'en' ? 'Add Landmark' : 'Pridėti orientyrą'}
          </button>
          <button
            type="button"
            onClick={() => setShowFileImport(true)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Import File' : 'Importuoti failą'}
          </button>
        </div>
      </form>

      {showLocationSearch && (
        <LocationSearchDialog
          onClose={() => setShowLocationSearch(false)}
          onSelect={handleLocationSelect}
          initialSearch={formData.name}
          language={language}
        />
      )}

      {showFileImport && (
        <FileImportDialog
          onClose={() => setShowFileImport(false)}
          onImport={handleFileImport}
          language={language}
        />
      )}
    </div>
  );
}