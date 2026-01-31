import React, { useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

function Recenter({ positions }: { positions: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!positions) return;
    if (positions[0] !== 0 && positions[1] !== 0) {
      map.setView(positions, map.getZoom(), {
        animate: true,
      });
    }
  }, [positions, map]);

  return null;
}

function LiveMap({ userLocation, deliveryBoyLocation }: any) {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });
  //   console.log("delivery location", deliveryBoyIcon);

  const center = [userLocation.lat, userLocation.long];
  const linePositions =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.lat, userLocation.long],
          [deliveryBoyLocation.lat, deliveryBoyLocation.long],
        ]
      : [];

  console.log("line positions", linePositions);

  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow relative">
      <MapContainer
        className="w-full h-full "
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
      >
        <Recenter positions={center as any} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[userLocation.lat, userLocation.long]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker
            position={[deliveryBoyLocation.lat, deliveryBoyLocation.long]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Person</Popup>
          </Marker>
        )}

        <Polyline positions={linePositions as any} color="orange" />
      </MapContainer>
    </div>
  );
}

export default LiveMap;
