import * as c from '../../common'
import getGptResponse from './gpt'

const maxAttempts = 3
export default async function getGameResponse(
  body: GameMessage[],
): Promise<GameGPTResponse | GameGPTResponseError> {
  const latestMessage = body[body.length - 1]
  if (latestMessage.role !== 'user')
    return { error: 'latest message is not user' }

  c.log(`generating based on messages:`, body)

  // const sanitizedMessage = c.sanitize(latestMessage.content)
  // latestMessage.content = sanitizedMessage.result

  let attempts = 0
  while (attempts < maxAttempts) {
    attempts++

    const response = await getGptResponse(body)
    if (!response) return { error: 'no response' }

    const regexResult = /(.*)\n[^:]*?:? ?(.*)\n(.*)/gi.exec(
      response,
    )

    if (!regexResult) {
      c.error(`regex failed for:`, response)
      continue
    }

    const [, rudenessString, ratingString, replyString] =
      regexResult

    const rudeness = yesNoMehToNumber(rudenessString)
    const rating = yesNoMehToNumber(ratingString)
    const reply = replyString.trim()
    const messages: GameMessage[] = [
      ...body,
      { content: reply, role: 'assistant' },
    ]

    c.sub(
      `"${latestMessage.content}" (rudeness: ${rudeness}, rating: ${rating})
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
  if (val.startsWith('no')) return 0
  return 0.5
}
