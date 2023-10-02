import { ChatCompletionMessageParam } from 'openai/resources/chat/index.mjs'
import * as c from '../../common'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

let tokensUsedSinceStart = 0
function tokensToCost(tokens: number) {
  const costPerToken = 0.0015 / 1000
  return c.r2(tokens * costPerToken, 4)
}

export default async function getGptResponse(
  messages: ChatCompletionMessageParam[],
  maxTokens = 100,
): Promise<string> {
  // c.l(`getting gpt response`, { messages, maxTokens })
  return getOutput(messages, maxTokens)
}

async function getOutput(
  messages: ChatCompletionMessageParam[],
  maxTokens = 40,
): Promise<string> {
  try {
    const tokens = maxTokens
    // c.sub(`getting gpt response`, { messages, tokens })

    // then, we get an actual response
    const response = await openai.chat.completions
      .create({
        model: `gpt-3.5-turbo`,
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

    if (!response) return ''
    const text = response.choices[0].message.content

    let output = (text || ``)
      // remove trailing sentence fragments
      .replace(/([!?.])[^!?.]+$/, `$1`)
      // replace leading spaces, quotes
      .replace(/^[\n\s"]*/gm, ``)
      .replace(/"\./g, ``) // sometimes got ". which is wrong obv
      .trim()

    // c.log(
    //   `GPT response:\n`,
    //   text,
    //   `\nparsed output:\n`,
    //   output,
    // )

    tokensUsedSinceStart +=
      response.usage?.total_tokens || 0
    if (c.lottery(1, 10))
      c.sub(
        `tokens used since server start: ${tokensUsedSinceStart} ($${tokensToCost(
          tokensUsedSinceStart,
        )})`,
      )

    if (!output) return ''
    return output
  } catch (e) {
    c.error(e)
    return ''
  }
}
