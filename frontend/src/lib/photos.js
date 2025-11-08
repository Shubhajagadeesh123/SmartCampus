// Choose what you prefer. Street View works everywhere with lat/lng.
// Places Photos usually look nicer when available.

export function streetViewUrl({ lat, lng }, { w = 400, h = 240 } = {}) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // size max is 640x640 for free tier
  return `https://maps.googleapis.com/maps/api/streetview?size=${w}x${h}&location=${lat},${lng}&key=${key}`;
}

// Optional: simple Places (browser) fetch using the JS Places library.
// Call once per marker click to avoid quota burn.
export function getPlacePhotoUrlByText(query, cb, { w = 400, h = 240 } = {}) {
  if (!window.google?.maps?.places) return cb(null);

  // Make a hidden map div for PlacesService
  const div = document.createElement("div");
  const svc = new window.google.maps.places.PlacesService(div);

  svc.findPlaceFromQuery(
    { query, fields: ["place_id", "photos"] },
    (res, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !res?.[0]) {
        cb(null); return;
      }
      const photo = res[0].photos?.[0];
      const url = photo ? photo.getUrl({ maxWidth: w, maxHeight: h }) : null;
      cb(url);
    }
  );
}
