import { METRES_PER_UNIT, ZONE_METRES } from './config.ts';

export type ZoneKey = 'beach' | 'pier' | 'promenade' | 'funfair';

export interface Zone {
  key: ZoneKey;
  name: string;
}

const BEACH: Zone = { key: 'beach', name: 'The beach' };
const ZONE_LIST: readonly Zone[] = [
  BEACH,
  { key: 'pier', name: 'The pier' },
  { key: 'promenade', name: 'The promenade' },
  { key: 'funfair', name: 'The fun fair' },
];

/** Zone number for a distance in metres. It keeps counting; the look cycles. */
export const zoneIndexAt = (metres: number): number => Math.floor(Math.max(0, metres) / ZONE_METRES);

export const zoneFor = (index: number): Zone => ZONE_LIST[((index % ZONE_LIST.length) + ZONE_LIST.length) % ZONE_LIST.length] ?? BEACH;

export const metresFromUnits = (units: number): number => units * METRES_PER_UNIT;
