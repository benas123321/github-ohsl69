import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { GeocodingResult } from '../types';

interface LocationSelectorProps {
  locations: GeocodingResult[];
  onSelect: (location: GeocodingResult) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 5);
  }, [center, map]);
  return null;
}

export function LocationSelector({ locations, onSelect }: LocationSelectorProps) {
  const center: [number, number] = [
    locations[0]?.lat || 0,
    locations[0]?.lon || 0
  ];

  const icon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Select the correct location</h2>
        <div className="h-[400px] mb-4">
          <MapContainer
            center={center}
            zoom={5}
            className="w-full h-full rounded-lg"
          >
            <MapController center={center} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {locations.map((location, index) => (
              <Marker
                key={`${location.lat}-${location.lon}-${index}`}
                position={[location.lat, location.lon]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelect(location)
                }}
              />
            ))}
          </MapContainer>
        </div>
        <p className="text-sm text-gray-600">
          Click on a marker to select the correct location
        </p>
      </div>
    </div>
  );
}