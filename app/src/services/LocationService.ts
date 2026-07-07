/**
 * LocationService abstracts geocoding and location retrieval.
 * Uses Nominatim (OpenStreetMap) as a free reverse-geocoding provider.
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

class LocationService {
  /**
   * Reverse geocodes coordinates to a city name using Nominatim API.
   * Free, no API key required, but requires User-Agent header and rate limiting.
   */
  async getCityFromCoordinates(coords: LocationCoordinates): Promise<string | null> {
    try {
      const { latitude, longitude } = coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LaborLinkApp/1.0',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      // Nominatim address hierarchy for city
      const address = data.address;
      if (address) {
        const city = address.city || address.town || address.village || address.county || address.state;
        return city || null;
      }
      return null;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return null; // Fallback to manual entry
    }
  }
}

export const locationService = new LocationService();
