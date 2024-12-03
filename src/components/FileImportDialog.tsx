import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Column {
  header: string;
  value: string;
}

interface FileImportDialogProps {
  onClose: () => void;
  onImport: (mappedData: any[]) => void;
  language: 'en' | 'lt';
}

export function FileImportDialog({ onClose, onImport, language }: FileImportDialogProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [mapping, setMapping] = useState({
    name: '',
    nameLt: '',
    type: '',
    country: '',
    latitude: '',
    longitude: '',
  });
  const [data, setData] = useState<any[]>([]);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target?.result, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      if (jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]).map(header => ({
          header,
          value: header
        }));
        setColumns(headers);
        setData(jsonData);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    const mappedData = data.map(row => ({
      name: mapping.name ? row[mapping.name] : undefined,
      nameLt: mapping.nameLt ? row[mapping.nameLt] : undefined,
      type: mapping.type ? row[mapping.type] : undefined,
      country: mapping.country ? row[mapping.country] : undefined,
      latitude: mapping.latitude ? parseFloat(row[mapping.latitude]) : undefined,
      longitude: mapping.longitude ? parseFloat(row[mapping.longitude]) : undefined,
    }));
    onImport(mappedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {language === 'en' ? 'Import Data' : 'Importuoti duomenis'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileRead(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          >
            <p className="text-gray-600">
              {language === 'en'
                ? 'Drop your Excel file here or'
                : 'Įkelkite Excel failą čia arba'}
            </p>
            <label className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
              {language === 'en' ? 'Browse Files' : 'Naršyti failus'}
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileRead(file);
                }}
              />
            </label>
          </div>

          {columns.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Name (English)' : 'Pavadinimas (Anglų)'}
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={mapping.name}
                    onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.header}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Name (Lithuanian)' : 'Pavadinimas (Lietuvių)'}
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={mapping.nameLt}
                    onChange={(e) => setMapping({ ...mapping, nameLt: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Type' : 'Tipas'}
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={mapping.type}
                    onChange={(e) => setMapping({ ...mapping, type: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.header}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Country' : 'Šalis'}
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={mapping.country}
                    onChange={(e) => setMapping({ ...mapping, country: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Latitude' : 'Platuma'}
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={mapping.latitude}
                    onChange={(e) => setMapping({ ...mapping, latitude: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.header}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Longitude' : 'Ilguma'}
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={mapping.longitude}
                    onChange={(e) => setMapping({ ...mapping, longitude: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleImport}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {language === 'en' ? 'Import Data' : 'Importuoti duomenis'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}