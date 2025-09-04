// utils/angle.ts
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

export function wrapToPi(angleRad: number): number {
  // normalize to (-PI, PI]
  while (angleRad <= -Math.PI) angleRad += 2 * Math.PI;
  while (angleRad > Math.PI) angleRad -= 2 * Math.PI;
  return angleRad;
}

/** Signed shortest difference current - reference, in radians (range: (-PI, PI]) */
export function signedAngleDiff(referenceRad: number, currentRad: number): number {
  return wrapToPi(currentRad - referenceRad);
}

/** Check if current is within ±rangeDeg of reference. Returns detailed result. */
export function isWithinAngleRange(
  referenceRad: number,
  currentRad: number,
  rangeDeg = 10
) {
  const diffRad = signedAngleDiff(referenceRad, currentRad);
  const diffDeg = diffRad * RAD_TO_DEG;
  const within = Math.abs(diffDeg) <= rangeDeg;
  return { within, diffRad, diffDeg };
}