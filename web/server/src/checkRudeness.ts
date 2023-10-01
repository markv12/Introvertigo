import * as c from '../../common'
import getGptResponse from './gpt'

export async function checkRudeness(
  message: string,
  previousMessage: string,
): Promise<number> {
  //   const response = await getGptResponse(
  //     [
  //       {
  //         role: 'system',
  //         content: `ONLY RESPOND WITH A NUMBER.
  // You rank the politeness of messages. Respond to each message with a number from 1 to 10 where 1 is VERY rude and 10 is polite.
  // This is in response to the text, "${previousMessage}".
  // How polite is the following message? ONLY RESPOND WITH A NUMBER.`,
  //       },
  //       { role: 'user', content: message },
  //     ],
  //     1,
  //   )
  //   const rudeness = oneToTenStringToNegativeOneToOne(
  //     response || '5',
  //   )

  const response = (
    await getGptResponse(
      [
        {
          role: 'system',
          content: `You rank the politeness/clarity of messages. Respond to each message with "polite", "rude", or "neutral".
This is in response to the text, "${previousMessage}".
How polite is the following message? Only respond with "polite", "rude", or "neutral".`,
        },
        { role: 'user', content: message },
      ],
      6,
    )
  )
    .replace(/"/g, '')
    .toLowerCase()
  let rudeness = 0
  if (response.includes('polite')) rudeness = -1
  else if (response.includes('rude')) rudeness = 1

  c.sub(`rudeness is ${rudeness} (response: ${response})`)
  return rudeness
}

export async function checkInterest(
  message: string,
  previousMessage: string,
  context: string,
): Promise<number> {
  //   c.log({ message, previousMessage, context })
  //   const response = await getGptResponse(
  //     [
  //       {
  //         role: 'system',
  //         content: `ONLY RESPOND WITH A NUMBER.
  // You rank how interesting/engaging a message is in a conversation.
  // You are particularly interested in ${context}.
  // Respond to each message with a number from 1 to 10 where 1 is NOT interesting and 10 is VERY interesting/engaging.
  // ONLY RESPOND WITH A NUMBER.`,
  //       },
  //       { role: 'user', content: message },
  //     ],
  //     1,
  //   )
  //   const interest = oneToTenStringToNegativeOneToOne(
  //     response || '5',
  //   )

  const response = (
    await getGptResponse(
      [
        {
          role: 'system',
          content: `You rank how interesting/engaging a message is in a conversation.
Your character's context is: ${context}.
Respond to each message with "interesting", "not interesting", or "neutral". Only respond with one of those three options.`,
        },
        { role: 'user', content: message },
      ],
      7,
    )
  )
    .replace(/"/g, '')
    .toLowerCase()
  let interest = 0
  if (response.includes('not')) interest = -1
  else if (response.includes('interesting')) interest = 1

  c.sub(`interest is ${interest} (response: ${response})`)
  return interest
}

const oneToTenStringToNegativeOneToOne = (val: string) => {
  const num = parseInt(val.replace(/"/g, ''))
  if (isNaN(num)) return 0
  const zeroToOne = (num - 1) / 9
  return c.clamp(-1, c.r2(zeroToOne * 2 - 1), 1)
}

const negativeTenToTenStringToNegativeOneToOne = (
  val: string,
) => {
  const num = parseInt(val.replace(/\D/g, ''))
  if (isNaN(num)) return 0
  return c.clamp(-1, c.r2(num / 10), 1)
}
