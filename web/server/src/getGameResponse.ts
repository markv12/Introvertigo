import * as c from '../../common'
import getGptResponse from './gpt'
import { responseFormatCommand } from './sceneData'

const maxAttempts = 1
export default async function getGameResponse(
  body: GameMessage[],
): Promise<GameGPTResponse | GameGPTResponseError> {
  const latestMessage = body[body.length - 1]
  if (latestMessage.role !== 'user')
    return { error: 'latest message is not user' }

  if (body.length > 5)
    // * throw out old messages
    body = [body[0], ...body.slice(-4)]

  // c.log(`generating based on messages:`, body)

  // if last system message is more than 2 messages ago, we'll add a new one
  if (
    body.findLastIndex((m) => m.role === 'system') <
    body.length - 2
  ) {
    body.push()
  }

  // const sanitizedMessage = c.sanitize(latestMessage.content)
  // latestMessage.content = sanitizedMessage.result

  let attempts = 0
  while (attempts < maxAttempts) {
    attempts++

    const response = await getGptResponse([
      ...body.slice(0, -1),
      // * we toss in a reminder for the prompt that doesn't get added to the official message list
      {
        content: responseFormatCommand,
        role: 'system',
      },
      latestMessage,
    ])
    if (!response) return { error: 'no response' }

    const regexResult =
      /(.*)\n[^:]*?:? ?(.*)\n"?(.*)"?$/gi.exec(response)

    if (!regexResult) {
      c.error(`regex failed for:`, response)
      if (attempts < maxAttempts) continue
      else {
        c.log(`returning anyway`)
        return {
          rudeness: 0,
          rating: 0,
          reply: response,
          messages: [
            ...body,
            { content: response, role: 'assistant' },
          ],
        }
      }
    }

    const [, rudenessString, ratingString, replyString] =
      regexResult

    const rudeness =
      oneToTenStringToNegativeOneToOne(rudenessString)
    const rating =
      oneToTenStringToNegativeOneToOne(ratingString)
    const reply = replyString.trim()
    const messages: GameMessage[] = [
      ...body,
      { content: reply, role: 'assistant' },
    ]

    c.sub(
      `"${latestMessage.content}" (rudeness: ${rudeness}[${rudenessString}], rating: ${rating}[${ratingString}])
  -> "${reply}"`,
    )

    return {
      rudeness,
      rating,
      reply,
      messages,
    }
  }

  return {
    error: `failed to access api ${maxAttempts} times`,
  }
}

const yesNoMehToNumber = (val: string) => {
  val = val.toLowerCase()
  if (val.startsWith('yes')) return 1
  if (val.startsWith('no')) return -1
  return 0
}

const oneToTenStringToNegativeOneToOne = (val: string) => {
  const num = parseInt(val)
  if (isNaN(num)) return 0
  const zeroToOne = (num - 1) / 9
  return c.r2(zeroToOne * 2 - 1)
}
