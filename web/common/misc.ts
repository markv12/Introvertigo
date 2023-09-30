import * as globals from './globals'
import * as math from './math'
export const megabytesPerCharacter = 1.0e-6

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function clearUndefinedProperties(obj: object) {
  for (let key in obj) {
    if (obj[key] === undefined) delete obj[key]
  }
}

export function clearFunctions(obj: object) {
  for (let key in obj) {
    if (typeof obj[key] === `function`) delete obj[key]
  }
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
export function randomXFromArray<T>(
  array: T[],
  returnCount: number,
): T[] {
  const validOptions: T[] = [...array]
  const toReturn: T[] = []
  if (!validOptions.length) return toReturn
  if (returnCount >= validOptions.length)
    return validOptions
  while (toReturn.length < returnCount) {
    const index = Math.floor(
      Math.random() * validOptions.length,
    )

    const toAdd = validOptions[index]
    if (toReturn.includes(toAdd)) continue

    toReturn.push(toAdd)
    validOptions.splice(index, 1)
  }
  return toReturn
}

export function everyXthElementFromArray<T>(
  arr: T[],
  x: number,
  includeFirstAndLast = false,
): T[] {
  const toReturn: T[] = []
  if (includeFirstAndLast) toReturn.push(arr[0])
  x = Math.max(1, x)
  for (
    let i = includeFirstAndLast ? 1 : 0;
    i < arr.length - (includeFirstAndLast ? 1 : 0);
    i++
  ) {
    if (i % x === x - 1) toReturn.push(arr[i])
  }
  if (includeFirstAndLast)
    toReturn.push(arr[arr.length - 1])
  return toReturn
}

export function randomWithWeights<E>(
  elements:
    | { weight: number; value: E }[]
    | { [key: string]: number },
): E {
  let toUse: { weight: number; value: E }[] = []
  if (Array.isArray(elements)) toUse = elements
  else
    for (let key in elements)
      toUse.push({
        weight: elements[key]!,
        value: key as any,
      })

  const total: number = toUse.reduce(
    (total, e) => e.weight + total,
    0,
  )
  const random = Math.random() * total
  let currentCount = 0
  for (let i = 0; i < toUse.length; i++) {
    currentCount += toUse[i].weight
    if (currentCount >= random) return toUse[i].value
  }
  console.log(
    `failed to get weighted random value from`,
    elements,
  )
  return toUse[0]?.value
}

export function coinFlip() {
  return Math.random() > 0.5
}

export function debounce(fn: Function, time = 700) {
  let timeout: any
  return (...params: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...params)
    }, time)
  }
}
/** debounce, but ensure it gets called at least once every "ensure" */
export function debounceWithEnsure(
  fn: Function,
  time = 700,
  ensure = 700,
) {
  let timeout: any
  let lastCalled = Date.now()
  return (...params: any[]) => {
    if (timeout) clearTimeout(timeout)
    const now = Date.now()
    const timeToCall = Math.max(
      0,
      Math.min(time, ensure - (now - lastCalled)),
    )
    if (timeToCall === 0) {
      fn(...params)
      lastCalled = now
      return
    }
    timeout = setTimeout(() => {
      fn(...params)
      lastCalled = now
    }, timeToCall)
  }
}

export function hash(s?: string) {
  if (!s) return 0
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i)
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char
    // eslint-disable-next-line no-bitwise
    hash &= hash // Convert to 32bit integer
  }
  return hash
}

export function arrayMove(
  arr: any[] = [],
  oldIndex: number = 0,
  newIndex: number = 0,
): void {
  if (!Array.isArray(arr) || !arr.length) return
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
}

export function shuffleArray(array: any[]): any[] {
  const toReturn = [...array]
  for (let i = toReturn.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[toReturn[i], toReturn[j]] = [toReturn[j], toReturn[i]]
  }
  return toReturn
}

export function profileObject(
  obj: object,
  targetPath?: any[],
  maxDepth = 3,
  path: string[] = [],
): string {
  const st = (o: any) => {
    try {
      return math.r2(JSON.stringify(o).length / 1000, 2)
    } catch (e) {
      return 0
    }
  }

  let output =
    (path.length ? path.join(`.`) : `total`) +
    `: ${st(obj)}kb`
  if (typeof obj !== `object` || !obj || !maxDepth)
    return output
  output += ` | `
  output += Object.keys(obj)
    .sort((a, b) => st(obj[b]) - st(obj[a]))
    .slice(0, 4)
    .map(
      (k) =>
        `${
          !isNaN(parseInt(k)) ? (obj[k] as any)?.id || k : k
        }: ${st(obj[k])}kb${
          Array.isArray(obj[k]) ? ` (${obj[k].length})` : ``
        }`,
    )
    .join(`, `)

  if (maxDepth > 1)
    if (targetPath) {
      const targetProp = targetPath.shift()
      if (targetProp !== undefined) {
        const targetObj = obj[targetProp]
        if (targetObj) {
          output += `\n${profileObject(
            targetObj,
            targetPath,
            maxDepth - 1,
            [...path, targetProp],
          )}`
        }
      } else if (
        Array.isArray(obj) &&
        obj.length &&
        typeof obj[0] === `object`
      ) {
        const keysWithSize = {}
        for (let el of obj) {
          for (let key in el) {
            if (typeof el[key] === `object`) {
              keysWithSize[key] =
                (keysWithSize[key] || 0) + st(el[key])
            }
          }
        }
        const sortedKeys = Object.keys(keysWithSize).sort(
          (a, b) => keysWithSize[b] - keysWithSize[a],
        )
        output += `\n${sortedKeys
          .slice(0, 3)
          .map(
            (k) =>
              `${k}: ${math.r2(
                keysWithSize[k] / obj.length,
                2,
              )}kb/element`,
          )
          .join(`, `)}`
      }
    } else
      for (let key in obj) {
        if (typeof obj[key] === `object`) {
          output += `\n${profileObject(
            obj[key],
            undefined,
            maxDepth - 1,
            [...path, key],
          )}`
        }
      }
  return output
}
