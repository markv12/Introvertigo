import * as c from '../../common'
import {
  checkInterest,
  checkRudeness,
} from './checkRudeness'
import getGptResponse from './gpt'

export default async function getGameResponse(
  body: GameMessage[],
): Promise<GameGPTResponse | GameGPTResponseError> {
  const firstMessage = body[0]
  const latestMessage = body[body.length - 1]
  if (latestMessage.role !== 'user')
    return { error: 'latest message is not user' }
  if (latestMessage.content.length > 100)
    latestMessage.content = latestMessage.content.slice(
      0,
      100,
    )

  if (body.length > 3)
    // * throw out old messages
    body = [body[0], ...body.slice(-2)]

  c.log(`generating based on messages:`, body)

  // if last system message is more than 2 messages ago, we'll add a new one
  if (
    body.findLastIndex((m) => m.role === 'system') <
    body.length - 2
  ) {
    body.push()
  }

  // const sanitizedMessage = c.sanitize(latestMessage.content)
  // latestMessage.content = sanitizedMessage.result

  const keyWords = firstMessage.content.slice(
    firstMessage.content.indexOf('If the topics of ') + 17,
    firstMessage.content.indexOf('are mentioned'),
  )

  const promises = [
    checkRudeness(latestMessage.content),
    checkInterest(
      latestMessage.content,
      body[body.length - 2]?.content || '',
      keyWords,
    ),
    getGptResponse(body),
  ]
  const [rudeness, interest, reply] = await Promise.all(
    promises,
  )
  if (!reply) return { error: 'no response' }

  const messages: GameMessage[] = [
    ...body,
    { content: reply as string, role: 'assistant' },
  ]

  c.sub(
    `"${latestMessage.content}" (rudeness: ${rudeness}, interest: ${interest})
  -> "${reply}"`,
  )

  return {
    rudeness: rudeness as number,
    rating: interest as number,
    reply: reply as string,
    messages,
  }
}
