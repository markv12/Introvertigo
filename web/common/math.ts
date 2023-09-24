import * as globals from './globals'

export function average(...args: number[]): number {
  args = args.filter((a) => typeof a === `number`)
  return args.reduce((a, b) => a + b, 0) / args.length
}

export function lerp(
  v0: number = 0,
  v1: number = 1,
  t: number = 0.5,
  clamp = false,
) {
  if (clamp) t = Math.min(Math.max(0, t), 1)
  return v0 * (1 - t) + v1 * t
}
export function qLerp(
  a: number = 0,
  b: number = 1,
  t: number = 0.5,
  clamp = false,
): number {
  // "quadratic interpolation"
  if (clamp) t = Math.min(Math.max(0, t), 1)
  return lerp(a, b, t ** 2, clamp)
}

export function clamp(
  lowerBound: number = 0,
  n: number = 0,
  upperBound: number = 1,
) {
  if (lowerBound > upperBound)
    [lowerBound, upperBound] = [upperBound, lowerBound]
  return Math.min(Math.max(lowerBound, n), upperBound)
}

export function sum(...args: number[]): number {
  args = args.filter((a) => typeof a === `number`)
  return args.reduce((a, b) => a + b, 0)
}

// roundTo:
// @param number (number) Initial number
// @param decimalPlaces (number) Number of decimal places to round to
// @param floor? (boolean) If true, uses floor instead of round.
//
export function r2( // "round to"
  number: number = 0,
  decimalPlaces: number = 2,
  floorOrCeil: `floor` | `ceil` | `round` = `round`,
): number {
  if (floorOrCeil === 'floor')
    return (
      Math.floor(number * 10 ** decimalPlaces) /
      10 ** decimalPlaces
    )
  if (floorOrCeil === `ceil`)
    return (
      Math.ceil(number * 10 ** decimalPlaces) /
      10 ** decimalPlaces
    )
  return (
    Math.round(number * 10 ** decimalPlaces) /
    10 ** decimalPlaces
  )
}

export function radiansToDegrees(radians: number = 0) {
  return (180 * radians) / Math.PI
}

export function degreesToRadians(degrees: number = 0) {
  return (degrees * Math.PI) / 180
}

export function vectorToRadians(
  vector2: [number, number] = [0, 0],
): number {
  const [x, y] = vector2
  const angle = Math.atan2(y || 0, x || 0)
  return angle
}
export function vectorToDegrees(
  vector2: [number, number] = [0, 0],
): number {
  return radiansToDegrees(vectorToRadians(vector2))
}
export function vectorAverage(
  vector2s: [number, number][] = [],
): [number, number] {
  const [x, y] = vector2s.reduce(
    (a, b) => [a[0] + (b[0] || 0), a[1] + (b[1] || 0)],
    [0, 0],
  )
  return [
    x / vector2s.length || 0,
    y / vector2s.length || 0,
  ]
}

export function distance(
  a: [number, number] | { location: [number, number] } = [
    0, 0,
  ],
  b: [number, number] | { location: [number, number] } = [
    0, 0,
  ],
) {
  if (`location` in a) return distance(a.location, b)
  if (`location` in b) return distance(a, b.location)
  const c = (a[0] || 0) - (b[0] || 0)
  const d = (a[1] || 0) - (b[1] || 0)
  return Math.sqrt(c * c + d * d) || 0
}

/**
 * distance in degrees [0, 360] between two angles
 */
export function angleFromAToB(
  a: [number, number] | null = [0, 0],
  b: [number, number] | null = [0, 0],
) {
  if (
    a?.[0] === undefined ||
    a?.[1] === undefined ||
    b?.[0] === undefined ||
    b?.[1] === undefined
  )
    return 0
  return (
    ((Math.atan2(
      (b[1] || 0) - (a[1] || 0),
      (b[0] || 0) - (a[0] || 0),
    ) *
      180) /
      Math.PI +
      360) %
    360
  )
}
export function mirrorAngleVertically(angle: number = 0) {
  return (360 - angle) % 360
}
export function mirrorAngleHorizontally(angle: number = 0) {
  return (540 - angle) % 360
}
/**
 * shortest distance (in degrees) between two angles.
 * It will be in range [0, 180] if not signed.
 */
export function angleDifference(
  a: number = 0,
  b: number = 0,
  signed = false,
): number {
  if (signed) {
    const d = Math.abs(a - b) % 360
    let r = d > 180 ? 360 - d : d
    // calculate sign
    const sign =
      (a - b >= 0 && a - b <= 180) ||
      (a - b <= -180 && a - b >= -360)
        ? 1
        : -1
    r *= sign
    return r
  }
  const c = Math.abs(b - a) % 360
  const d = c > 180 ? 360 - c : c
  return d
}

export function degreesToUnitVector(
  degrees: number = 0,
): [number, number] {
  let rad = (Math.PI * degrees) / 180
  let r = 1
  return [r * Math.cos(rad), r * Math.sin(rad)]
}

export function vectorToUnitVector(
  vector: [number, number] = [0, 0],
): [number, number] {
  const magnitude = vectorToMagnitude(vector)
  if (magnitude === 0) return [0, 0]
  return [
    (vector[0] || 0) / magnitude,
    (vector[1] || 0) / magnitude,
  ]
}

export function unitVectorFromThisPointTowardsThatPoint(
  thisPoint: [number, number] = [0, 0],
  thatPoint: [number, number] = [0, 0],
): [number, number] {
  if (
    (thisPoint[0] || 0) === (thatPoint[0] || 0) &&
    (thisPoint[1] || 0) === (thatPoint[1] || 0)
  )
    return [0, 0]
  const angleBetween = angleFromAToB(thisPoint, thatPoint)
  return degreesToUnitVector(angleBetween)
}

export function vectorToMagnitude(
  vector: [number, number] = [0, 0],
): number {
  return Math.sqrt(
    (vector[0] || 0) * (vector[0] || 0) +
      (vector[1] || 0) * (vector[1] || 0),
  )
}

export function vectorFromDegreesAndMagnitude(
  degrees: number = 0,
  magnitude: number = 1,
): [number, number] {
  const rad = (Math.PI * degrees) / 180
  return [
    magnitude * Math.cos(rad),
    magnitude * Math.sin(rad),
  ]
}

export function mirrorLocation(
  mirror: [number, number] = [0, 0],
  over: [number, number] = [0, 0],
): [number, number] {
  const [x, y] = over
  const [mx, my] = mirror
  return [mx + (mx - x), my + (my - y)]
}

export function pointIsInsideCircle(
  center: [number, number] = [0, 0],
  point: [number, number] = [1, 1],
  radius: number = 0,
): boolean {
  return (
    ((point[0] || 0) - (center[0] || 0)) *
      ((point[0] || 0) - (center[0] || 0)) +
      ((point[1] || 0) - (center[1] || 0)) *
        ((point[1] || 0) - (center[1] || 0)) <=
    radius * radius
  )
}

export function randomInsideCircle(
  radius: number,
  biasTowards?: `inside` | `outside`,
  offset: [number, number] = [0, 0],
): [number, number] {
  radius = radius || 0
  const newCoords = (): [number, number] => {
    return [
      Math.random() * radius * 2 - radius + offset[0],
      Math.random() * radius * 2 - radius + offset[1],
    ]
  }
  let coords = newCoords()
  while (!pointIsInsideCircle(offset, coords, radius))
    coords = newCoords()

  if (biasTowards === `inside`) {
    if (lottery(1, 2)) return coords
    const magnitude = vectorToMagnitude(coords)
    const newMagnitude = randomBetween(0, magnitude)
    const unitVector = vectorToUnitVector(coords)
    return [
      unitVector[0] * newMagnitude + offset[0],
      unitVector[1] * newMagnitude + offset[1],
    ]
  }
  if (biasTowards === `outside`) {
    if (lottery(1, 2)) return coords
    let magnitude = vectorToMagnitude(coords)
    const newMagnitude = randomBetween(magnitude, radius)
    const unitVector = vectorToUnitVector(coords)
    return [
      unitVector[0] * newMagnitude + offset[0],
      unitVector[1] * newMagnitude + offset[1],
    ]
  }

  return coords
}

export function randomBlurredVector2(
  around: [number, number] = [0, 0],
  radius: number = 1,
): [number, number] {
  const [x, y] = around
  return [
    x + randomBetween(-radius, radius),
    y + randomBetween(-radius, radius),
  ]
}

export function randomSign() {
  return Math.random() > 0.5 ? 1 : -1
}
export function lottery(
  odds: number = 1,
  outOf: number = 10,
): boolean {
  return Math.random() < odds / outOf
}
export function randomBetween(
  start: number = 1,
  end: number = 10,
) {
  const lesser = Math.min(start, end)
  const greater = Math.max(start, end)
  const diff = greater - lesser
  return Math.random() * diff + lesser
}
export function randomIntBetweenInclusive(
  start: number = 1,
  end: number = 10,
) {
  return Math.floor(randomBetween(start, end + 1))
}

export function closestPointOnLine(
  toPoint: [number, number],
  linePoint1: [number, number],
  linePoint2: [number, number],
): [number, number] {
  const [x1, y1] = linePoint1
  const [x2, y2] = linePoint2
  const [x3, y3] = toPoint
  const px = x2 - x1
  const py = y2 - y1
  const dAB = px * px + py * py
  const u = ((x3 - x1) * px + (y3 - y1) * py) / dAB
  const x = x1 + u * px
  const y = y1 + u * py
  return [x, y]
}
