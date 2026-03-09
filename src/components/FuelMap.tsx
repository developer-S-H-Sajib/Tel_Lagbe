import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pump } from '../data/pumps';
import { Share2, MapPin } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on fuel status
const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const iconGreen = createIcon('#22c55e'); // Green
const iconOrange = createIcon('#f97316'); // Orange
const iconRed = createIcon('#ef4444'); // Red

const getIcon = (status: string) => {
  if (status === 'তেল পাওয়া যাচ্ছে') return iconGreen;
  if (status === 'সীমিত তেল') return iconOrange;
  return iconRed;
};

interface FuelMapProps {
  pumps: Pump[];
  selectedPump: Pump | null;
}

const MapUpdater = ({ selectedPump }: { selectedPump: Pump | null }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedPump) {
      map.flyTo([selectedPump.lat, selectedPump.lng], 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedPump, map]);
  return null;
};

export const FuelMap: React.FC<FuelMapProps> = ({ pumps, selectedPump }) => {
  const handleShare = (pump: Pump) => {
    const shareText = `তেল লাগবে - ${pump.name}\nঅবস্থা: ${pump.fuelStatus}\nলাইন: ${pump.queueStatus}\nজেলা: ${pump.district}`;
    if (navigator.share) {
      navigator.share({
        title: 'তেল লাগবে',
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(shareText + '\n\n(কপি করে শেয়ার করুন)');
    }
  };

  return (
    <div className="w-full h-[450px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={[23.6850, 90.3563]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater selectedPump={selectedPump} />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
        >
          {pumps.map((pump) => (
            <Marker
              key={pump.id}
              position={[pump.lat, pump.lng]}
              icon={getIcon(pump.fuelStatus)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{pump.name}</h3>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <MapPin size={14} /> {pump.district}, {pump.division}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">জ্বালানি:</span>
                      <span className="font-medium">{pump.fuelType}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">তেলের অবস্থা:</span>
                      <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                        pump.fuelStatus === 'তেল পাওয়া যাচ্ছে' ? 'bg-green-100 text-green-700' :
                        pump.fuelStatus === 'সীমিত তেল' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pump.fuelStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">লাইন অবস্থা:</span>
                      <span className="font-medium">{pump.queueStatus}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md border border-gray-100 mb-3 italic text-sm text-gray-600 text-center">
                    "{pump.quote}"
                  </div>

                  <button
                    onClick={() => handleShare(pump)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    <Share2 size={16} /> শেয়ার করুন
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
