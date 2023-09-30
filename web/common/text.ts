import * as math from './math'
import * as misc from './misc'
import * as globals from './globals'
import { badWords } from './badwords'

class LanguageFilter {
  list = badWords
  splitRegex = /\b/
  placeHolder = ``
  regex = /[^a-zA-Z0-9|$|@]|\^/g
  replaceRegex = /\w/g

  isProfane(string: string = ``) {
    // some combo words got through, so adding manual check for those regardless of position/context
    for (let w of [
      `fuck`,
      `shit`,
      `bitch`,
      `cock`,
      `faggot`,
      `nigger`,
    ])
      if (string.indexOf(w) !== -1) return true

    return (
      this.list.filter((word: string) => {
        const wordExp = new RegExp(
          `\\b${word.replace(/(\W)/g, `\\$1`)}\\b`,
          `gi`,
        )
        return wordExp.test(string)
      }).length > 0 || false
    )
  }

  replaceWord(string: string = ``) {
    return string
      .replace(this.regex, ``)
      .replace(this.replaceRegex, this.placeHolder)
  }

  clean(string: string = ``) {
    return string
      .split(this.splitRegex)
      .map((word) => {
        return this.isProfane(word)
          ? this.replaceWord(word)
          : word
      })
      .join(this.splitRegex.exec(string)?.[0] || ``)
      .trim()
  }
}

export function id(prefix = ``) {
  return `${prefix}${`${Math.random()}`.split(`.`)[1]}`
}

export function numberWithCommas(x: number = 0) {
  const initialX = x
  let negative = false
  if (x < 0) {
    negative = true
    x = -x
  }
  if (x < 1000) return `${initialX}`
  const decimal = x % 1
  const total =
    Math.floor(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, `,`) +
    (decimal ? `${math.r2(decimal, 6)}`.substring(1) : ``)
  return (negative ? `-` : ``) + total
}

export function abbreviateNumber(
  number: number = 0,
  maxDecimalPlaces = 2,
) {
  const isNegative = number < 0
  if (isNegative) number = -number
  let output = ``
  if (number < 1000) output = `${math.r2(number, 0)}`
  else if (number < 1000000)
    output = `${math.r2(number / 1000, 0)}k`
  else if (number < 1000000000)
    output = `${math.r2(
      number / 1000000,
      Math.min(
        Math.max(
          maxDecimalPlaces,
          number / 1000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces,
        ),
        2,
      ),
    )}M`
  else if (number < 1000000000000)
    output = `${math.r2(
      number / 1000000000,
      Math.min(
        Math.max(
          maxDecimalPlaces,
          number / 1000000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces,
        ),
        2,
      ),
    )}B`
  else if (number < 1000000000000000)
    output = `${math.r2(
      number / 1000000000000,
      Math.min(
        Math.max(
          maxDecimalPlaces,
          number / 1000000000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces,
        ),
        2,
      ),
    )}T`
  else
    output = `${math.r2(
      number / 1000000000000000,
      Math.min(
        Math.max(
          maxDecimalPlaces,
          number / 1000000000000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces,
        ),
        2,
      ),
    )}Q`

  return (isNegative ? `-` : ``) + output
}

export function toBadWord(s: string | number = `a`) {
  const l = badWords.length
  if (typeof s === `number`) return badWords[s % l]
  let sum = 0
  for (let i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i)
  }
  return badWords[sum % l].replace(`igg`, `***`)
}

export function printList(
  list: string[] = [],
  separator = `and`,
): string {
  if (!list || !Array.isArray(list) || !list.length)
    return ``
  if (list.length === 1) return list[0]
  if (list.length === 2)
    return `${list[0]} ${separator} ${list[1]}`.trim()
  return (
    list.slice(0, list.length - 1).join(`, `) +
    `, ${separator} ` +
    list[list.length - 1]
  ).trim()
}

export function percentToTextBars(
  percent: number = 0,
  barCount = 10,
): string {
  const bars: string[] = []
  const barGap = 1 / barCount
  for (let i = 0; i < 1; i += 1 / barCount) {
    bars.push(
      Math.max(i - barGap / 2, 0) + barGap / 4 < percent
        ? `■`
        : `□`,
    )
  }
  return `\`` + bars.join(``) + `\``
}

export const skipWords = [
  `a`,
  `an`,
  `and`,
  `the`,
  `of`,
  `in`,
  `to`,
  `per`,
]
export function capitalize(
  string: string = ``,
  firstOnly = false,
): string {
  return (string || ``)
    .toLowerCase()
    .split(` `)
    .map((s, index) => {
      if (skipWords.includes(s) && index > 0) return s
      if (firstOnly && index > 0) return s
      return (
        s.substring(0, 1).toUpperCase() +
        s.substring(1).toLowerCase()
      )
    })
    .join(` `)
}
export function startsWithVowel(
  string: string = ``,
): boolean {
  return [`a`, `e`, `i`, `o`, `u`].includes(
    string.substring(0, 1).toLowerCase(),
  )
}

const filter = new LanguageFilter()
export function sanitize(string: string | null = ``) {
  if (!string) string = ``
  string = string.replace(/\n\r\t`/g, ``).trim()
  const withoutURLs = string.replace(
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*)/gi,
    ``,
  )
  const withoutEmojis = withoutURLs.replace(
    /[\u{1F600}-\u{1F6FF}]/gu,
    ``,
  )
  const cleaned = filter.clean(withoutEmojis)
  return {
    ok: string === cleaned,
    result: cleaned,
    message:
      string === cleaned
        ? `ok`
        : `Sorry, you can't use language like that here.`,
  }
}

export function camelCaseToWords(
  string: string = ``,
  capitalizeFirst?: boolean,
): string {
  if (typeof string !== `string`) string = `${string}`
  let s = string.replace(/([A-Z])/g, ` $1`)
  if (capitalizeFirst)
    s = s.replace(/^./, (str) => str.toUpperCase())
  return s
}

export function acronym(string: string = ``): string {
  return string
    .replace(/[^a-z A-Z]/g, ``)
    .split(` `)
    .map((s) => {
      if (skipWords.includes(s.toLowerCase())) return ``
      return s.substring(0, 1)
    })
    .filter((w) => w)
    .join(``)
    .toUpperCase()
}

export function msToTimeString(
  ms: number = 0,
  short = false,
): string {
  const negativePrefix = ms < 0 ? `-` : ``
  if (negativePrefix) ms *= -1
  let remainingSeconds = Math.floor(ms / 1000)

  let years: any = Math.floor(
    remainingSeconds / (60 * 60 * 24 * 365),
  )
  remainingSeconds -= years * 60 * 60 * 24 * 365

  let days: any = Math.floor(
    remainingSeconds / (60 * 60 * 24),
  )
  remainingSeconds -= days * 60 * 60 * 24

  let hours: any = Math.floor(remainingSeconds / (60 * 60))
  remainingSeconds -= hours * 60 * 60

  let minutes: any = Math.floor(remainingSeconds / 60)
  remainingSeconds -= minutes * 60
  // if (minutes < 10 && hours > 0) minutes = `0${minutes}`

  let seconds: any = remainingSeconds
  if (seconds < 10 && minutes > 0) seconds = `0${seconds}`

  if (!years && !days && !hours && !minutes)
    return `${negativePrefix}${seconds}s`
  if (!years && !days && !hours)
    return `${negativePrefix}${minutes}${
      !short && seconds ? `:${seconds}` : `m`
    }`
  if (!years && !days)
    return `${negativePrefix}${hours}h${
      !short && minutes ? ` ${minutes}m` : ``
    }`
  if (!years)
    return `${negativePrefix}${days}d${
      !short && hours ? ` ${hours}h` : ``
    }`
  return `${negativePrefix}${years}y${
    !short && days ? ` ${days}d` : ``
  }`
}

export const possibleRandomCharacters: string = `ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz1234567890.,$%&*-?!'🚀⚡️📣🙏💳🪐💪🌏🛸🌌🔧🎉🧭📍🔥🛠📦📡⏱😀☠️👍👎🖕👀 あいうえおるった月火水木金土월화수목금토일`

export function garble(
  string: string = ``,
  percent = 0,
): string {
  if (percent > 0.98) percent = 0.98
  let splitString: string[] = string.split(` `)

  // move words around
  while (Math.random() < percent * 0.8) {
    misc.arrayMove(
      splitString,
      Math.floor(splitString.length * Math.random()),
      Math.floor(splitString.length * Math.random()),
    )
  }

  if (percent > 0.1) {
    // move letters around
    splitString = splitString.map((word: string) => {
      let characters: string[] = word.split(``)
      while (Math.random() < percent * 0.6) {
        misc.arrayMove(
          characters,
          Math.floor(characters.length * Math.random()),
          Math.floor(characters.length * Math.random()),
        )
      }

      if (percent > 0.3) {
        // randomize letters
        characters = characters.map((char: string) => {
          if (Math.random() < percent * 0.4) {
            char = possibleRandomCharacters.charAt(
              Math.floor(
                Math.random() *
                  possibleRandomCharacters.length,
              ),
            )
          }
          return char
        })
      }
      return characters.join(``)
    })
  }
  return splitString.join(` `)
}

export function selectRandomSentence(
  fullText: string = ``,
  count = 1,
): string {
  if (!fullText || !fullText.length) return ``
  const splitters = [`!`, `?`, `.`]
  // Split the fullText into sentences based on the splitters while preserving the ending punctuation
  const sentences = fullText.split(
    new RegExp(`(?<=[${splitters.join(``)}])\\s+`),
  )

  // Remove empty elements from the sentences array
  const nonEmptySentences = sentences.filter(
    (sentence) => sentence.trim().length > 0,
  )

  // If there are no valid sentences, return an empty string
  if (nonEmptySentences.length === 0) return ``

  // If count is greater than the number of sentences, adjust it to the maximum available
  const numSentences = Math.min(
    count,
    nonEmptySentences.length,
  )

  // Select random starting index and ensure it does not exceed the valid range
  const startingIndex = Math.floor(
    Math.random() *
      (nonEmptySentences.length - numSentences + 1),
  )

  // Get the consecutive sentences based on the starting index
  const selectedSentences = nonEmptySentences.slice(
    startingIndex,
    startingIndex + numSentences,
  )

  // If count is 1, return a single sentence; otherwise, return an array of sentences
  return count === 1
    ? selectedSentences[0]
    : selectedSentences.join(` `)
}

export function hueNumberToColorString(
  hue: number,
): string {
  if (hue < 30) return `red`
  if (hue < 90) return `orange`
  if (hue < 150) return `yellow`
  if (hue < 210) return `green`
  if (hue < 270) return `blue`
  if (hue < 330) return `purple`
  return `red`
}
