export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Haversine formülü ile iki koordinat arasındaki kuş uçuşu mesafeyi metre cinsinden hesaplar.
 */
export function distanceInMeters(from: Coordinates, to: Coordinates): number {
  const earthRadius = 6_371_000; // Dünya yarıçapı (metre)
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Mesafeyi insan tarafından okunabilir formata dönüştürür (örn: "45 m", "1.2 km").
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Check-in tolerans kontrolü:
 * Temel yarıçap 250 metre olup, cihaz doğruluğu (accuracy) ile birlikte maksimum 400 metreye kadar esneklik tanır.
 */
export function isCheckInAllowed(distance: number, accuracy: number = 0): {
  allowed: boolean;
  maxDistance: number;
  remainingDistance: number;
} {
  const reportedAccuracy = Number.isFinite(accuracy) ? Math.max(0, accuracy) : 0;
  const maxDistance = Math.min(400, 250 + Math.min(reportedAccuracy, 150));
  const allowed = distance <= maxDistance;
  const remainingDistance = Math.max(0, Math.round(distance - maxDistance));

  return {
    allowed,
    maxDistance,
    remainingDistance,
  };
}
