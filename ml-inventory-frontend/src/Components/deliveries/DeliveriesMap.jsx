import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DeliveriesMap.css';
import Loading from "../loading/Loading"

// Correction des icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Fonction utilitaire pour valider les coordonnées lat/lng
const isValidLatLng = (lat, lng) => (
  lat !== null &&
  lng !== null &&
  lat !== undefined &&
  lng !== undefined &&
  !isNaN(lat) &&
  !isNaN(lng)
);

const DeliveriesMap = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/deliveries', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch deliveries');
        const data = await response.json();
        setDeliveries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Filtrer uniquement les livraisons "delivered"
  const deliveredDeliveries = deliveries.filter(delivery => delivery.status === 'delivered');

  // Calculer le centre de la carte à partir des coordonnées valides (destinations uniquement)
  const calculateCenter = () => {
    const validCoords = deliveredDeliveries
      .map(d => {
        const lat = parseFloat(d.to_latitude);
        const lng = parseFloat(d.to_longitude);
        if (isValidLatLng(lat, lng)) {
          return [lat, lng];
        }
        return null;
      })
      .filter(Boolean);

    if (validCoords.length === 0) return [31.7917, -7.0926]; // Centre du Maroc par défaut

    const sumLat = validCoords.reduce((sum, [lat]) => sum + lat, 0);
    const sumLng = validCoords.reduce((sum, [, lng]) => sum + lng, 0);

    return [
      sumLat / validCoords.length,
      sumLng / validCoords.length
    ];
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  const center = calculateCenter();

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {deliveredDeliveries.map(delivery => {
          const toLat = parseFloat(delivery.to_latitude);
          const toLng = parseFloat(delivery.to_longitude);

          if (!isValidLatLng(toLat, toLng)) {
            return null; // Ignore si coords invalides
          }

          return (
            <Marker
              key={delivery.id}
              position={[toLat, toLng]}
              icon={L.icon({
                ...L.Icon.Default.prototype.options,
                iconUrl: '/destination-icon.png',
                iconSize: [32, 32],
              })}
            >
              <Popup>
                <strong>Destination:</strong> {delivery.to_location}<br />
                <strong>Recipient:</strong> {delivery.recipient_name}<br />
                <strong>Status:</strong> {delivery.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DeliveriesMap;
