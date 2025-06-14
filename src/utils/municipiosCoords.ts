
// Coordenadas de los principales municipios del Cauca
export const municipiosCoords: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Popayán': { lat: 2.4448, lng: -76.6147, zoom: 12 },
  'Patía': { lat: 2.0667, lng: -77.0333, zoom: 11 },
  'Guapi': { lat: 2.5667, lng: -77.8833, zoom: 11 },
  'Timbiquí': { lat: 2.7667, lng: -77.6833, zoom: 11 },
  'López de Micay': { lat: 2.9333, lng: -77.2667, zoom: 11 },
  'Santander de Quilichao': { lat: 3.0167, lng: -76.4833, zoom: 12 },
  'Puerto Tejada': { lat: 3.2333, lng: -76.4167, zoom: 12 },
  'Caldono': { lat: 2.8333, lng: -76.5667, zoom: 11 },
  'Toribío': { lat: 3.1167, lng: -76.0667, zoom: 11 },
  'Jambaló': { lat: 2.7667, lng: -76.2833, zoom: 11 },
  'Silvia': { lat: 2.6167, lng: -76.3833, zoom: 11 },
  'Páez (Belalcázar)': { lat: 2.5833, lng: -76.0667, zoom: 11 },
  'Inzá': { lat: 2.5500, lng: -76.0500, zoom: 11 },
  'Tierradentro': { lat: 2.6000, lng: -76.0000, zoom: 10 },
  'Bolívar': { lat: 1.8667, lng: -77.1833, zoom: 11 },
  'Mercaderes': { lat: 1.8167, lng: -77.2167, zoom: 11 },
  'Florencia': { lat: 1.6167, lng: -76.6167, zoom: 11 },
  'Sotará': { lat: 2.1167, lng: -76.6333, zoom: 11 },
  'Rosas': { lat: 1.6500, lng: -77.1500, zoom: 11 },
  'La Sierra': { lat: 1.5833, lng: -76.8833, zoom: 11 },
  'El Tambo': { lat: 2.4500, lng: -76.8167, zoom: 11 },
  'Timbío': { lat: 2.3444, lng: -76.6847, zoom: 12 },
  'Morales': { lat: 3.1167, lng: -76.6167, zoom: 11 },
  'Piendamó': { lat: 2.6333, lng: -76.9833, zoom: 11 },
  'Cajibío': { lat: 2.5667, lng: -76.8333, zoom: 11 },
  'Argelia': { lat: 2.3000, lng: -77.0333, zoom: 11 },
  'Balboa': { lat: 1.8000, lng: -77.4000, zoom: 11 },
  'Almaguer': { lat: 1.9167, lng: -76.8667, zoom: 11 },
  'San Sebastián': { lat: 1.7167, lng: -76.9333, zoom: 11 },
  'Santa Rosa': { lat: 1.5667, lng: -76.9167, zoom: 11 },
  'Sucre': { lat: 1.2833, lng: -77.1167, zoom: 11 }
};

export const getCoordsForRegion = (region: string) => {
  return municipiosCoords[region] || { lat: 2.4448, lng: -76.6147, zoom: 8 }; // Default a Popayán
};
