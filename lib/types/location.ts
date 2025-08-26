export interface AddressSearchResult {
  address: {
    freeformAddress: string;
    country: string;
    countryCode: string;
    municipality: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    state: string;
    city: string;
  };
  position: {
    lat: number;
    lon: number;
  };
}

export interface LocationData {
  fullAddress: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  continent: string;
  city?: string;
  state?: string;
  postalCode?: string;
  streetName?: string;
  streetNumber?: string;
}

// Continent mapping function
export const getContinentFromCountryCode = (countryCode: string): string => {
  const continentMap: Record<string, string> = {
    NG: "Africa",
    US: "North America",
    GB: "Europe",
    CA: "North America",
    AU: "Oceania",
    IN: "Asia",
    CN: "Asia",
    BR: "South America",
    FR: "Europe",
    DE: "Europe",
    // Add more mappings as needed
  };
  return continentMap[countryCode] || "Unknown";
};
