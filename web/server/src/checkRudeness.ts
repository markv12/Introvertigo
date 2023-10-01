import * as c from '../../common'
import getGptResponse from './gpt'

export async function checkRudeness(
  message: string,
): Promise<number> {
  const response = await getGptResponse([
    {
      role: 'system',
      content:
        'You rank politeness and clarity. Respond to each message with a number from 1 to 10 where 1 is polite and sensible and 10 is rude or unintelligible.',
    },
    { role: 'user', content: message },
  ])
  const rudeness = oneToTenStringToNegativeOneToOne(
    response || '5',
  )
  c.sub(`rudeness is ${rudeness}`)
  return rudeness
}

export async function checkInterest(
  message: string,
  previousMessage: string,
  context: string,
): Promise<number> {
  c.log({ message, previousMessage, context })
  const response = await getGptResponse([
    {
      role: 'system',
      content: `You rank how interesting/engaging something is in a conversation. Respond to each new message with a number from 1 to 10 where 1 is NOT and 10 is VERY interesting/engaging.
Context is: ${context}
Previous message was: ${previousMessage}`,
    },
    { role: 'user', content: message },
  ])
  const interest = oneToTenStringToNegativeOneToOne(
    response || '5',
  )
  c.sub(`interest is ${interest}`)
  return interest
}

const oneToTenStringToNegativeOneToOne = (val: string) => {
  const num = parseInt(val)
  if (isNaN(num)) return 0
  const zeroToOne = (num - 1) / 9
  return c.clamp(-1, c.r2(zeroToOne * 2 - 1), 1)
}
