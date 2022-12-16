/**
 * Longitude within [-180; 180] (subtract period)
 * @param {Number} lng longitude
 * @returns longitude within [-180; 180]
 */
export default function normalizeLng(lng: number): number {
  if (lng < -180) return lng + Math.ceil((lng + 180) / -360) * 360;
  else if (lng > 180) return lng - Math.ceil((lng - 180) / 360) * 360;
  return lng;
}
