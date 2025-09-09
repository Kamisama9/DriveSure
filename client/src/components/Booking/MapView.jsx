import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

export default function MapView({
  isLoaded,
  loadError,
  center,
  mapOptions,
  fromCoord,
  toCoord,
  directions,
  nearby,
}) {
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={14}
      options={mapOptions}
    >
      {fromCoord && <Marker position={fromCoord} label="A" />}
      {toCoord && <Marker position={toCoord} label="B" />}
      {directions && <DirectionsRenderer directions={directions} />}
      {nearby.map((n, i) => (
        <Marker key={i} position={n} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" }} />
      ))}
    </GoogleMap>
  );
}
