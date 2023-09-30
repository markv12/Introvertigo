import * as c from '../../common'

export default function generateScene(): GameSceneInitData {
  const keyWeights: { [key: string]: number } = {}
  for (const key in sceneData) {
    keyWeights[key] = sceneData[key as SceneKey].probability
  }

  const key = c.randomWithWeights(keyWeights) as SceneKey

  const backstory = sceneData[key].backstory
  const requiredWords = c.randomXFromArray(
    sceneData[key].userRequiredWords,
    3,
  )

  const scene: GameSceneInitData = {
    key,
    backstory,
    messages: getInitialMessages(key),
    requiredWords,
  }
  return scene
}

interface SceneGeneratorData {
  probability: number
  backstory: string
  ratingCondition: string
  userRequiredWords: string[]
  hiddenTriggerWords: string[]
  systemIntro: string
  firstMessage: string
}

const sceneData: { [key in SceneKey]: SceneGeneratorData } =
  {
    urinal: {
      probability: 1,
      backstory: `You finally made it to the bathroom after drinking three sports drinks. You just started your business when a strange man strikes up a conversation. Get out of the conversation as fast as possible!`,

      systemIntro: `You are a WAY too persistent guy standing at the urinal next to the user. You have started an awkward conversation with them that you will try to keep going. You speak in a South Dakota accent, and your word choice is a little over-personal.`,

      firstMessage: `Heyyyy there bud, what's the news?`,

      ratingCondition: 'how engaging their response was',

      hiddenTriggerWords: [
        'gymnastics',
        'Latin',
        'fishing',
      ],

      userRequiredWords: [
        'bar',
        'diamond',
        'coins',
        'philosophy',
        'bait',
        'orange',
        'splash',
        'snapper',
        'flip',
        'king',
        'port',
        'tackle',
        'fly',
        'screen',
        'mount',
        'tumble',
      ],
    },
  }

function getInitialMessages(key: SceneKey) {
  const messages: GameMessage[] = []
  messages.push({
    content:
      sceneData[key].systemIntro +
      ` Even if the conversation seems to falter, keep it going! If the topics of ${c.printList(
        sceneData[key].hiddenTriggerWords,
        'or',
      )} are mentioned you will get very excited, but you won't bring them up yourself.
      
      You MUST respond to every message in this three line format:
      - Rate how rude you think the user is being from 1 (very polite) to 10 (very rude)
      - Rate ${
        sceneData[key].ratingCondition
      } from 1 (low) to 10 (high)
      - Finally, respond in 1-2 sentences.
      
      EXAMPLE RESPONSE:
      3
      9
      (sentence text)`,
    role: `system`,
  })
  messages.push({
    content: sceneData[key].firstMessage,
    role: `assistant`,
  })
  return messages
}
