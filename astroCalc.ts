/**
 * Astrological chart calculations using astronomy-engine.
 * Planet positions are geocentric ecliptic longitudes.
 * Houses use the Equal House system.
 * Accuracy: sub-arcminute for Sun; ~1° for Moon; < 1° for outer planets.
 */

import * as Astronomy from 'astronomy-engine';

// ── Types ──────────────────────────────────────────────────────────────────

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface PlanetPlacement {
  sign: ZodiacSign;
  degree: number;   // 0–29 within sign
  house?: number;   // 1–12 (only if birth time known)
}

export interface CalculatedChart {
  sun: PlanetPlacement;
  moon: PlanetPlacement;
  rising?: PlanetPlacement;
  mercury: PlanetPlacement;
  venus: PlanetPlacement;
  mars: PlanetPlacement;
  jupiter: PlanetPlacement;
  saturn: PlanetPlacement;
  uranus: PlanetPlacement;
  neptune: PlanetPlacement;
  pluto: PlanetPlacement;
  northNode: PlanetPlacement;
  mc?: PlanetPlacement;
  hasTime: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

function norm(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function signFromLong(long: number): { sign: ZodiacSign; degree: number } {
  const l = norm(long);
  const idx = Math.floor(l / 30);
  return { sign: SIGNS[idx], degree: Math.floor(l % 30) };
}

function dateToJD(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Mean longitude of Moon's ascending node (North Node) */
function northNodeLong(date: Date): number {
  const T = (dateToJD(date) - 2451545.0) / 36525;
  return norm(
    125.04452
    - 1934.136261 * T
    + 0.0020708 * T * T
    + (T * T * T) / 450000,
  );
}

/** Geocentric ecliptic longitude for a planet via astronomy-engine */
function geoEclLong(body: Astronomy.Body, time: Astronomy.AstroTime): number {
  const vec = Astronomy.GeoVector(body, time, true);
  const ecl = Astronomy.Ecliptic(vec);
  return norm(ecl.elon);
}

/**
 * Ascendant ecliptic longitude using the standard formula.
 * Requires accurate birth time.
 */
function calcAscendant(time: Astronomy.AstroTime, lat: number, lng: number): number {
  const gst = Astronomy.SiderealTime(time);        // hours 0–24
  const lst = ((gst + lng / 15) % 24 + 24) % 24;  // local sidereal time
  const RAMC = lst * 15;                           // degrees

  const T = (time.tt - 2451545.0) / 36525;
  const eps = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const phi = lat * (Math.PI / 180);
  const r   = RAMC * (Math.PI / 180);

  const asc = Math.atan2(
    -Math.cos(r),
    Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(r),
  );
  return norm(asc * (180 / Math.PI));
}

/** Midheaven (MC) ecliptic longitude */
function calcMC(time: Astronomy.AstroTime, lng: number): number {
  const gst  = Astronomy.SiderealTime(time);
  const lst  = ((gst + lng / 15) % 24 + 24) % 24;
  const RAMC = lst * 15;
  const T    = (time.tt - 2451545.0) / 36525;
  const eps  = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const r    = RAMC * (Math.PI / 180);
  const mc   = Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(eps));
  return norm(mc * (180 / Math.PI));
}

/** Equal house number (1–12) for a planet given the ascendant */
function houseNumber(planetLong: number, ascLong: number): number {
  const diff = norm(planetLong - ascLong);
  return Math.floor(diff / 30) + 1;
}

// ── Public API ─────────────────────────────────────────────────────────────

export function calculateChart(
  birthDate: Date,
  lat: number,
  lng: number,
  hasTime: boolean,
): CalculatedChart {
  const time = Astronomy.MakeTime(birthDate);

  const bodies: { key: keyof Omit<CalculatedChart, 'rising' | 'mc' | 'hasTime' | 'northNode'>; body: Astronomy.Body }[] = [
    { key: 'sun',     body: Astronomy.Body.Sun },
    { key: 'moon',    body: Astronomy.Body.Moon },
    { key: 'mercury', body: Astronomy.Body.Mercury },
    { key: 'venus',   body: Astronomy.Body.Venus },
    { key: 'mars',    body: Astronomy.Body.Mars },
    { key: 'jupiter', body: Astronomy.Body.Jupiter },
    { key: 'saturn',  body: Astronomy.Body.Saturn },
    { key: 'uranus',  body: Astronomy.Body.Uranus },
    { key: 'neptune', body: Astronomy.Body.Neptune },
    { key: 'pluto',   body: Astronomy.Body.Pluto },
  ];

  // Planet ecliptic longitudes
  const longs: Record<string, number> = {};
  for (const { key, body } of bodies) {
    longs[key] = geoEclLong(body, time);
  }
  longs['northNode'] = northNodeLong(birthDate);

  let ascLong: number | undefined;
  let mcLong: number | undefined;

  if (hasTime) {
    ascLong = calcAscendant(time, lat, lng);
    mcLong  = calcMC(time, lng);
  }

  function placement(long: number): PlanetPlacement {
    const { sign, degree } = signFromLong(long);
    return {
      sign,
      degree,
      ...(ascLong !== undefined ? { house: houseNumber(long, ascLong) } : {}),
    };
  }

  const chart: CalculatedChart = {
    sun:       placement(longs['sun']),
    moon:      placement(longs['moon']),
    mercury:   placement(longs['mercury']),
    venus:     placement(longs['venus']),
    mars:      placement(longs['mars']),
    jupiter:   placement(longs['jupiter']),
    saturn:    placement(longs['saturn']),
    uranus:    placement(longs['uranus']),
    neptune:   placement(longs['neptune']),
    pluto:     placement(longs['pluto']),
    northNode: placement(longs['northNode']),
    hasTime,
  };

  if (ascLong !== undefined) {
    chart.rising = { ...signFromLong(ascLong), house: 1 };
  }
  if (mcLong !== undefined) {
    chart.mc = { ...signFromLong(mcLong), house: houseNumber(mcLong, ascLong!) };
  }

  return chart;
}
