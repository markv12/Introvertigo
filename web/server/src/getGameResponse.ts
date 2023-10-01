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
  const latestMessageText = latestMessage.content.slice(
    0,
    100,
  )
  const secondLatestMessageText =
    body[body.length - 2]?.content.slice(0, 100) || ''

  let contextToGiveChatGPT = [...body]
  if (contextToGiveChatGPT.length > 3)
    // * throw out old messages in prompts
    contextToGiveChatGPT = [
      contextToGiveChatGPT[0],
      ...contextToGiveChatGPT.slice(-2),
    ]

  // c.log(`generating based on messages:`, body)

  // const sanitizedMessage = c.sanitize(latestMessageText)
  // latestMessageText = sanitizedMessage.result

  const fullContext = firstMessage.content.slice(
    0,
    firstMessage.content.indexOf('\n'),
  )
  // const keyWords = firstMessage.content.slice(
  //   firstMessage.content.indexOf('If the topics of ') + 17,
  //   firstMessage.content.indexOf('are mentioned'),
  // )

  const promises = [
    checkRudeness(
      latestMessageText,
      secondLatestMessageText,
    ),
    checkInterest(
      latestMessageText,
      secondLatestMessageText,
      fullContext,
    ),
    getGptResponse(contextToGiveChatGPT),
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
