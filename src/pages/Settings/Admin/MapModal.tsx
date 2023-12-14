import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Modal from 'react-modal';
import Button from '../../../components/UI/Button';

const MapModal: React.FC<{ onLocationSelect: (location: string) => void }> = ({ onLocationSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

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
          setLocationName(data.display_name);
        }
      })
      .catch((err) => {
        setError('Error fetching location data');
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMapClick = (e: any) => {
    setSelectedLocation([e.latlng.lat, e.latlng.lng]);
    fetchLocationName(e.latlng.lat, e.latlng.lng);
  };

  const confirmLocation = () => {
    if (locationName) {
      onLocationSelect(locationName);
      closeModal();
    }
  };

  const MyMap = () => {
    const map = useMap();

    if (selectedLocation) {
      map.flyTo(selectedLocation, 14);
    }

    map.on('click', handleMapClick);

    return null;
  };

  return (
    <div>
      <Button variant='secondary' className='text-xs bg-slate-200 w-40' onClick={openModal}>Select Location</Button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Map Modal"
        className="md:w-8/12 md:absolute md:bottom-20 mt-40 p-2 md:mt-0 md:right-10"
      >
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locationName && (
            <Marker position={selectedLocation || [0, 0]}>
              <Popup>
                <div className="flex flex-col gap-3">
                <div className=" w-fit m-auto text-xl">Selected Location</div>
                <div className="">
                {locationName}
                </div>
                <Button  variant='secondary' className='text-xs bg-gray-700 text-gray-700 ml-2 rounded-md p-2' onClick={confirmLocation}>Confirm</Button>
                </div>
              </Popup>
            </Marker>
          )}
          <MyMap />
        </MapContainer>
      </Modal>
    </div>
  );
};

export default MapModal;
