export const isValidCoordinate = (v: any): v is number => {
  const n = Number(v);
  return Number.isFinite(n) && Math.abs(n) <= 180;
};

export const isValidLocation = (loc: any): loc is { latitude: number; longitude: number } => {
  if (!loc) return false;
  return isValidCoordinate(loc.latitude) && isValidCoordinate(loc.longitude);
};

export default { isValidCoordinate, isValidLocation };
