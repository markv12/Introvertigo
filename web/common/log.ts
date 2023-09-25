const fillCharacter = `.`

let ignoreGray = false
let showingDebugLogs = false
let longest = 0

const reset = `\x1b[0m`,
  dim = `\x1b[2m`,
  bright = `\x1b[1m`

const colors: any = {
  gray: `\x1b[2m`,
  red: `\x1b[31m`,
  green: `\x1b[32m`,
  yellow: `\x1b[33m`,
  blue: `\x1b[34m`,
  pink: `\x1b[35m`,
  cyan: `\x1b[36m`,
  white: `\x1b[37m`,
}

const dirColors: any = {
  red: `\x1b[31m`,
  green: `\x1b[32m`,
  yellow: `\x1b[33m`,
  blue: `\x1b[34m`,
  pink: `\x1b[35m`,
  cyan: `\x1b[36m`,
}

const browser = typeof window !== `undefined`

export const l = log
export function log(...args: any[]): void {
  const regexResult =
    /(?:[^\n\r]*log\.[jt]s[^\n]*\n)+(?:[^\n]*?massProfiler[^\n]*?\.[jt]s[^\n]*\n)?(?:[^\n]*?embedProfiler[^\n]*?\.[jt]s[^\n]*\n)?([^\n\r]*\/([^/\n\r]+\/[^/\n\r]+\/[^/:\n\r]+))\.[^:\n\r]+:(\d+)/gi.exec(
      `${new Error().stack}`,
    )
  const fullPath: string = regexResult?.[1] || ``
  const lineNumber: string = regexResult?.[3] || ``
  const pathName: string =
    regexResult?.[2]?.replace(/(dist\/|src\/)/gi, ``) || ``

  if (ignoreGray && args[0] === `gray`) return

  let mainColor = `white`

  for (let index = 0; index < args.length; index++) {
    let arg = args[index]
    if (index === 0 && arg === `debug`) {
      if (!showingDebugLogs) return
      mainColor = `gray`
      args[index] = `🐛`
    }
    if (
      index === 0 &&
      typeof arg === `string` &&
      arg in colors
    )
      mainColor = arg

    // apply mainColor to all strings
    if (index === 0 && mainColor !== `white`) {
      if (!args[index + 1]) continue
      for (
        let nextArgIndex = 1;
        nextArgIndex < args.length;
        nextArgIndex++
      ) {
        if (browser) continue
        if (typeof args[nextArgIndex] === `object`) continue
        args[nextArgIndex] =
          colors[mainColor] +
          `${args[nextArgIndex]}` +
          reset
      }

      // remove 'gray' or 'green' etc
      if (
        index === 0 &&
        typeof arg === `string` &&
        arg in colors
      )
        args.splice(index, 1)
    }
  }

  // let mainDirColor = !mainDir
  //   ? ``
  //   : Object.values(dirColors)[
  //       mainDir
  //         .split(``)
  //         .map((c) => c.charCodeAt(0))
  //         .reduce((total, curr) => curr + total, 0) %
  //         Object.values(dirColors).length
  //     ]

  let prefix = String(
    (browser ? `` : reset) +
      (browser ? `` : dim) +
      `${new Date().toLocaleTimeString(undefined, {
        hour12: false,
        hour: `2-digit`,
        minute: `2-digit`,
      })} ` +
      pathName +
      `:` +
      lineNumber,
  )

  if (prefix.length > longest) longest = prefix.length
  if (!browser)
    while (
      prefix.length < Math.min(45, Math.max(25, longest))
    )
      prefix += fillCharacter
  if (!browser) prefix += reset

  console.log(prefix, ...args)
}

export function trace(
  message?: any,
  ...optionalParams: any[]
) {
  if (message)
    log(
      message,
      ...optionalParams,
      `\n  Trace: `,
      `${new Error().stack}`
        .replace(/^.*\n.*\n/, ``)
        .trim()
        .replace(/^at /, ``),
    )
}

export function error(...args: any[]) {
  log(`red`, ...args)
}
export function info(...args: any[]) {
  log(`blue`, ...args)
}
export function warn(...args: any[]) {
  log(`yellow`, ...args)
}
export function success(...args: any[]) {
  log(`green`, ...args)
}
export function sub(...args: any[]) {
  log(`gray`, ...args)
}

export function showDebugLogs(shouldShow: boolean) {
  showingDebugLogs = Boolean(shouldShow)
}
export function isShowingDebugLogs() {
  return showingDebugLogs
}
