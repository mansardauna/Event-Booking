import React, { useState, useEffect } from 'react';
import { Location } from 'iconsax-react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CurrentLocation: React.FC = () => {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [fullLocationName, setFullLocationName] = useState<string | null>(null); // Full location name for pop-up
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationName(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const fetchLocationName = (latitude: number, longitude: number) => {
    const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

    fetch(nominatimApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.display_name) {
          const shortenedName = shortenLocationName(data.display_name);
          setLocationName(shortenedName);
          setFullLocationName(data.display_name);
        }
      })
      .catch((err: any) => {
        setError('Error fetching location data');
      });
  };

  const shortenLocationName = (fullName: string) => {
    return fullName.length > 15 ? fullName.substring(0, 15) + '...' : fullName;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const startSelectingLocation = () => {
    setIsSelectingLocation(true);
    openModal();
  };

  const handleMapClick = (e: any) => {
    if (e.latlng && isSelectingLocation) {
      setSelectedLocation([e.latlng.lat, e.latlng.lng]);
    }
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      fetchLocationName(selectedLocation[0], selectedLocation[1]);
      setIsSelectingLocation(false);
      closeModal();
    }
  };

  const MyMap = () => {
    const map = useMap();
    if (isSelectingLocation) {
      map.on('click', handleMapClick);
    }
    return null;
  };

  return (
    <div className='flex justify-center gap-2 items-center'>
      <div onClick={startSelectingLocation} className='cursor-pointer'>
        <Location size={20} />
      </div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div className='location-display' title={fullLocationName || undefined}>
          {locationName || 'Loading...'}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel='Choose Location'
        className='w-8/12 absolute right-10 bottom-10 bg-white p-4 rounded-lg shadow-lg'
      >
        <div>
          <h2 className='text-2xl font-bold mb-4'>Choose Location</h2>
          <div className='mb-4'>
            <div onClick={handleMapClick} style={{ height: '400px', width: '100%' }}>
              <MapContainer center={selectedLocation || [0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                {selectedLocation && (
                  <Marker position={selectedLocation}>
                    <Popup className='absolute bottom-3 right-3 z-50'>{fullLocationName || 'Selected Location'}</Popup>
                  </Marker>
                )}
                <MyMap />
              </MapContainer>
            </div>
          </div>
          <button
            onClick={confirmLocation}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none'
          >
            Confirm Location
          </button>
          <button
            onClick={closeModal}
            className='ml-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 focus:outline-none'
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CurrentLocation;
