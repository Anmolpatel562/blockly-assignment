import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import car from "../assets/pngegg.png";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5tb2xwYXRlbDU2MiIsImEiOiJjbHp0dmhkY3IxeXhuMmlzM3Nxa2xkZXl5In0.gzMz6e7phFHtB-OVbxD-zQ";

const vehicleIcon = new L.Icon({
  iconUrl: car,
  iconSize: [50, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destination, setDestination] = useState("");

  // Watch user's current location in real-time
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        setCurrentPosition(newPosition);
      },
      (error) => {
        console.error("Error getting current position", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();

    if (!destination || !currentPosition) return;

    try {
      // Geocode the destination address to get the coordinates
      const geocodeResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          destination
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const destinationCoordinates =
        geocodeResponse.data.features[0].center.reverse();

      const routeResponse = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentPosition[1]},${currentPosition[0]};${destinationCoordinates[1]},${destinationCoordinates[0]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const coordinates = routeResponse.data.routes[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );

      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching the route", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleDestinationSubmit}
        style={{
          position: "absolute",
          zIndex: 1000,
          padding: "10px",
          background: "white",
          left: "50px",
          top: "10px",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          style={{ width: "200px", padding: "10px" }}
          list="places"
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Go
        </button>
       
        
      </form>
      {currentPosition && (
        <MapContainer
          center={currentPosition}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors'
          />
          {/* Marker for the current location (User's real-time location) */}
          <Marker position={currentPosition} icon={vehicleIcon} />
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="green" />
          )}
        </MapContainer>
      )}
    </>
  );
};

export default Map;
