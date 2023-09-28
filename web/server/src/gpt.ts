import { ChatCompletionMessageParam } from 'openai/resources/chat/index.mjs'
import * as c from '../../common'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export default async function getGptResponse(
  systemContext: string = '',
  userMessage: string = '',
  maxTokens = 100,
): Promise<string | undefined> {
  return getOutput(systemContext, userMessage, maxTokens)
}

async function getOutput(
  systemContext: string,
  userMessage: string,
  maxTokens = 100,
) {
  try {
    const tokens = maxTokens
    c.sub(`getting gpt response`, { tokens })

    const messages: ChatCompletionMessageParam[] = []
    if (systemContext?.length)
      messages.push({
        content: systemContext,
        role: `system`,
      })
    if (userMessage?.length)
      messages.push({
        content: userMessage,
        role: `user`,
      })
    c.log(`GPT prompt:`, messages)

    // then, we get an actual response
    const response = await openai.chat.completions
      .create({
        //     messages:
        model: `gpt-3.5-turbo`, // `text-${useLowQualityGeneration ? `curie-001` : `davinci-003`}`,
        messages,
        // eslint-disable-next-line
        max_tokens: tokens,
        temperature: 1,
        // eslint-disable-next-line
        top_p: 1,
        // eslint-disable-next-line
        presence_penalty: 1,
        // eslint-disable-next-line
        // frequency_penalty: 1.2,
      })
      .catch((e) => {
        c.error(e)
      })

    if (!response) return undefined
    const text = response.choices[0].message.content

    let output = (text || ``)
      // remove trailing sentence fragments
      .replace(/([!?.])[^!?.]+$/, `$1`)
      // replace leading spaces, quotes
      .replace(/^[\n\s"]*/gm, ``)
      .replace(/"\./g, ``) // sometimes got ". which is wrong obv
      .trim()

    c.log(
      `GPT response:\n`,
      text,
      `\nparsed output:\n`,
      output,
    )
    if (!output) return undefined
    return output
  } catch (e) {
    c.error(e)
    return undefined
  }
}
