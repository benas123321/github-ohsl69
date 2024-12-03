import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { GeocodingResult } from '../types';

interface LocationSelectorProps {
  locations: GeocodingResult[];
  onSelect: (location: GeocodingResult) => void;
  language: 'en' | 'lt';
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 5);
  }, [center, map]);
  return null;
}

export function LocationSelector({ locations, onSelect, language }: LocationSelectorProps) {
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
    <div className="h-[400px] mb-4">
      <MapContainer
        center={center}
        zoom={5}
        className="w-full h-full rounded-lg"
      >
        <MapController center={center} />
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
  );
}