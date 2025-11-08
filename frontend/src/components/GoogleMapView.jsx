import { useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

export default function GoogleMapView({ college }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [activePoi, setActivePoi] = useState(null);
  const center = useMemo(() => college?.center || { lat: 20.5937, lng: 78.9629 }, [college]);

  if (loadError) return <div style={{ color: "red" }}>Failed to load Google Maps.</div>;
  if (!isLoaded) return <div>Loading map…</div>;
  if (!college) return <div>Select a college to view its map.</div>;

  return (
    <div style={{ height: "70vh", width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        zoom={16}
        center={center}
        options={{ mapTypeControl: false, streetViewControl: false }}
      >
        {/* College center marker */}
        <Marker position={center} onClick={() => setActivePoi({ name: college.name, position: center })} />

        {/* POIs inside campus */}
        {college.pois?.map((p) => (
          <Marker
            key={`${p.name}-${p.lat}-${p.lng}`}
            position={{ lat: p.lat, lng: p.lng }}
            onClick={() => setActivePoi({ name: p.name, position: { lat: p.lat, lng: p.lng } })}
          />
        ))}

        {activePoi && (
          <InfoWindow position={activePoi.position} onCloseClick={() => setActivePoi(null)}>
            <div style={{ maxWidth: 220 }}>
              <strong>{activePoi.name}</strong>
              {college.details?.address && <div style={{ fontSize: 12 }}>{college.details.address}</div>}
              {college.details?.website && (
                <div style={{ fontSize: 12 }}>
                  <a href={college.details.website} target="_blank" rel="noreferrer">Website</a>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
