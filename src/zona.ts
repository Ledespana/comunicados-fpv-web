// Zona de vuelo (círculo) en el formato GeoJSON del formulario de Interior (drones.ses.mir.es).
// Misma lógica que fpv-kit/.claude/skills/comunicado-vuelo/scripts/zona.js.

export interface Zona {
  /** Texto para formCampos:pestanas:zona_actN:mapa_value */
  mapaValue: string;
  /** "lat,lon,17" para Lugar de protección / recuperación */
  lugar: string;
  /** [[lon,lat],...] cerrado, para guardar el sitio */
  poligono: [number, number][];
}

export function zonaCirculo(lat: number, lon: number, radioM = 100, lados = 16): Zona {
  const rLat = radioM / 111320;
  const rLon = radioM / (111320 * Math.cos((lat * Math.PI) / 180));
  const poligono: [number, number][] = [];
  for (let i = 0; i < lados; i++) {
    const a = (2 * Math.PI * i) / lados;
    poligono.push([+(lon + rLon * Math.sin(a)).toFixed(7), +(lat + rLat * Math.cos(a)).toFixed(7)]);
  }
  poligono.push(poligono[0]);
  const fc = {
    features: [
      {
        geometry: { coordinates: [poligono], type: "Polygon" },
        id: "1",
        type: "Feature",
        properties: {
          tipo: "Generica", visible: true, color: "#0000FF", centrado: false, editable: false, precision: 0,
          animado: false, lineaDiscontinua: false, soloContorno: false, origen: false, destino: false, opacity: "0.3",
        },
      },
    ],
    type: "FeatureCollection",
  };
  return { mapaValue: JSON.stringify(fc), lugar: `${lat.toFixed(5)},${lon.toFixed(5)},17`, poligono };
}
