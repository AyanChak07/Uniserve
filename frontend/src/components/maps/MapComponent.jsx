import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon bug in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create emoji icon for Marker
const createEmojiIcon = (emoji) => {
  return L.divIcon({
    html: `<div style="font-size:28px; text-align:center; line-height:28px;">${emoji}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
};

// Pan and zoom map to fit route
function FitRouteView({ routeLine }) {
  const map = useMap();
  useEffect(() => {
    if (!routeLine) return;
    const bounds = L.latLngBounds(routeLine);
    map.fitBounds(bounds, { padding: [70, 70] });
  }, [routeLine, map]);
  return null;
}

const MapComponent = ({ center, markers, zoom = 13, height = "400px", routeLine }) => {
  return (
    <div style={{ height, width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers?.map((marker, idx) =>
          marker.emoji ? (
            <Marker key={idx} position={marker.position} icon={createEmojiIcon(marker.emoji)}>
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          ) : (
            <Marker key={idx} position={marker.position}>
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          )
        )}
        {routeLine && (
          <>
            <FitRouteView routeLine={routeLine} />
            <Polyline
              positions={routeLine}
              pathOptions={{ color: "blue", weight: 4, opacity: 0.7, dashArray: "10" }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;