import * as c from '../../common'
import getGptResponse from './gpt'

const maxAttempts = 3
export default async function getGameResponse(
  body: GameMessage[],
): Promise<GameGPTResponse | GameGPTResponseError> {
  const latestMessage = body[body.length - 1]
  if (latestMessage.role !== 'user')
    return { error: 'latest message is not user' }

  // const sanitizedMessage = c.sanitize(latestMessage.content)
  // latestMessage.content = sanitizedMessage.result

  let attempts = 0
  while (attempts < maxAttempts) {
    const response = await getGptResponse(body)
    if (!response) return { error: 'no response' }

    const regexResult =
      /[^:]*?:? ?([0-9]+).*\n[^:]*?:? ?([0-9]+).*\n(.*)/gi.exec(
        response,
      )
    if (!regexResult) {
      c.error(`regex failed for:`, response)
      return { error: 'regex failed' }
    }

    const [, rudenessString, ratingString, replyString] =
      regexResult
    const rudeness = parseInt(rudenessString)
    const rating = parseInt(ratingString)
    const reply = replyString.trim()
    const messages: GameMessage[] = [
      ...body,
      { content: reply, role: 'assistant' },
    ]

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
