import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { Landmark, LandmarkType, GeocodingResult } from '../types';
import { getGeoData } from '../services/geocoding';
import { LocationSelector } from './LocationSelector';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';
import * as XLSX from 'xlsx';

interface LandmarkFormProps {
  onAddLandmark: (landmark: Landmark) => void;
}

const normalizeString = (str: string) => {
  return str.toLowerCase()
    .replace(/ą/g, 'a').replace(/č/g, 'c').replace(/ę/g, 'e')
    .replace(/ė/g, 'e').replace(/į/g, 'i').replace(/š/g, 's')
    .replace(/ų/g, 'u').replace(/ū/g, 'u').replace(/ž/g, 'z');
};

export function LandmarkForm({ onAddLandmark }: LandmarkFormProps) {
  const [showOptional, setShowOptional] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameLt: '',
    type: 'city' as LandmarkType,
    latitude: '',
    longitude: '',
    country: ''
  });
  const [locations, setLocations] = useState<GeocodingResult[]>([]);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      const results = await getGeoData(formData.name, formData.type);
      if (results && results.length > 0) {
        if (results.length === 1) {
          handleLocationSelect(results[0]);
        } else {
          setLocations(results);
          setShowLocationSelector(true);
        }
        return;
      }
    }

    const landmark: Landmark = {
      id: nanoid(),
      name: formData.name,
      nameLt: formData.nameLt || undefined,
      type: formData.type,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      country: formData.country || undefined
    };

    onAddLandmark(landmark);
    setFormData({
      name: '',
      nameLt: '',
      type: 'city',
      latitude: '',
      longitude: '',
      country: ''
    });
  };

  const handleLocationSelect = (location: GeocodingResult) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.lat.toString(),
      longitude: location.lon.toString()
    }));
    setShowLocationSelector(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        // Show sheet selection dialog
        const sheetNames = wb.SheetNames;
        const sheet = wb.Sheets[sheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        
        // Process the data
        data.forEach(async (row: any) => {
          const name = row.name || row.Name || row.NAME;
          const nameLt = row.nameLt || row.NameLt || row.NAME_LT;
          const type = row.type || row.Type || row.TYPE || 'city';
          
          if (name) {
            const results = await getGeoData(name, type);
            if (results && results.length > 0) {
              const landmark: Landmark = {
                id: nanoid(),
                name,
                nameLt: nameLt || undefined,
                type: type as LandmarkType,
                latitude: results[0].lat,
                longitude: results[0].lon,
                country: row.country || row.Country || row.COUNTRY
              };
              onAddLandmark(landmark);
            }
          }
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (Lithuanian)</label>
            <input
              type="text"
              value={formData.nameLt}
              onChange={(e) => setFormData({ ...formData, nameLt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as LandmarkType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
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

        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
        >
          <span>Optional Fields</span>
          {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showOptional && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Landmark
          </button>
          <label className="flex-1 cursor-pointer">
            <div className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              Import File
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </form>

      {showLocationSelector && locations.length > 0 && (
        <LocationSelector
          locations={locations}
          onSelect={handleLocationSelect}
        />
      )}
    </div>
  );
}