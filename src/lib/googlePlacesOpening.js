/**
 * Places API (New) — solo orari correnti (openNow, nextOpen/close).
 * Il numero di persone dentro il luogo NON è disponibile nelle API pubbliche Google Maps Platform.
 * @see https://developers.google.com/maps/documentation/places/web-service/place-details
 */

/**
 * @param {string} placeId es. ChIJ… (Place ID del museo)
 * @param {string} apiKey chiave con Places API (New) abilitata
 * @returns {Promise<{ openNow?: boolean, nextOpenTime?: string, nextCloseTime?: string } | null>}
 */
export async function fetchPlaceOpeningSnapshot(placeId, apiKey) {
  if (!placeId || !apiKey) return null;

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'currentOpeningHours,utcOffsetMinutes,displayName',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Places HTTP ${res.status}`);
  }

  const data = await res.json();
  const cur = data.currentOpeningHours;
  if (!cur) return { openNow: undefined, nextOpenTime: undefined, nextCloseTime: undefined };

  return {
    openNow: cur.openNow,
    nextOpenTime: cur.nextOpenTime,
    nextCloseTime: cur.nextCloseTime,
  };
}
