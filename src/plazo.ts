// Plazo de la comunicación previa a Interior: al menos 5 días naturales antes del vuelo.
// Las fechas se cuentan en hora de España (Europe/Madrid).

export const PLAZO_DIAS = 5;

function hoyEnEspana(ahora: Date): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(ahora)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

function diasEntre(desde: string, hasta: string): number {
  const a = Date.UTC(+desde.slice(0, 4), +desde.slice(5, 7) - 1, +desde.slice(8, 10));
  const b = Date.UTC(+hasta.slice(0, 4), +hasta.slice(5, 7) - 1, +hasta.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}

export interface ResultadoPlazo {
  hoy: string;
  fecha_vuelo: string;
  dias_de_antelacion: number;
  cumple: boolean;
  primer_dia_valido: string;
  mensaje: string;
}

export function comprobarPlazo(fechaVuelo: string, ahora = new Date()): ResultadoPlazo {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaVuelo) || Number.isNaN(Date.parse(fechaVuelo))) {
    throw new Error(`Fecha no válida: "${fechaVuelo}". Usa AAAA-MM-DD.`);
  }
  const hoy = hoyEnEspana(ahora);
  const dias = diasEntre(hoy, fechaVuelo);
  const [y, m, d] = hoy.split("-").map(Number);
  const primer = new Date(Date.UTC(y, m - 1, d + PLAZO_DIAS)).toISOString().slice(0, 10);
  const cumple = dias >= PLAZO_DIAS;
  const mensaje = dias < 0
    ? "La fecha ya ha pasado."
    : cumple
      ? `Cumple el plazo: faltan ${dias} días (mínimo ${PLAZO_DIAS}).`
      : `NO cumple el plazo: faltan ${dias} días y hacen falta ${PLAZO_DIAS} naturales. El primer día que se puede comunicar hoy es ${primer}.`;
  return { hoy, fecha_vuelo: fechaVuelo, dias_de_antelacion: dias, cumple, primer_dia_valido: primer, mensaje };
}
