import * as c from '../../common'

export default function generateScene(
  forceKey?: SceneKey,
): GameSceneInitData {
  const key =
    forceKey ||
    (c.randomWithWeights(keyWeights) as SceneKey)

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
      backstory: `You finally made it to the bathroom after drinking three sports drinks. You just started your business when suddenly another bathroom-goer starts talking to you. Get out of the conversation!`,

      systemIntro: `You are a WAY too persistent guy standing at the urinal next to the user. You have started an awkward conversation with them that you will try to keep going. You speak in a South Dakota accent, and your word choice is a little over-personal.`,

      firstMessage: `Heyyy there bud, how's your day going? This is my favorite part of the day.`,

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

    car: {
      probability: 1,
      backstory: `A not-so-friendly coworker is giving you a lift to work. It's a long drive, and as soon as you set off he starts diving deep into his personal life. Get out of the conversation without destroying your professional relationship!`,
      systemIntro: `You are a coworker of the user, and you are driving them to work. You are WAY too open about your marital problems, and you are also too interested in the user's personal life. You speak in a New York accent.`,
      firstMessage: `Hey pal, can I tell you something in confidence? I'm having trouble with my partner.`,
      ratingCondition: 'how emotionally satisfied you feel',
      hiddenTriggerWords: [
        'India',
        'sushi',
        'spreadsheets',
        'gaming',
      ],
      userRequiredWords: [
        'chicken',
        'roll',
        'ring',
        'column',
        'strategy',
        'pieces',
        'California',
        'dance',
        'trampoline',
        'wipe',
        'blow',
        'engine',
        'wrap',
        'lock',
        'barbecue',
      ],
    },
    grandma: {
      probability: 1,
      backstory: `Your grandma corners you at family thanksgiving and starts asking questions you don't feel comfortable answering. Get out of the conversation without hurting her feelings!`,
      systemIntro: `You are the user's grandma. You are WAY too interested in the user's personal life, wryly judgmental of their life choices, and a little hard of hearing. You pretend to be sweet, but you're actually a little mean.`,
      firstMessage: `So, honey, how's that little boyfriend of yours??`,
      ratingCondition:
        'how open you feel the user is being',
      hiddenTriggerWords: [
        'hiking',
        'singing',
        'Clark Gable',
        'the Mediterranean Sea',
      ],
      userRequiredWords: [
        'pumpkin',
        'candle',
        'cousin',
        'candy',
        'lullabye',
        'garden',
        'trail',
        'wind',
        'gone',
        'camera',
        'polka',
        'sunset',
        'Europe',
        'beaches',
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

const keyWeights: { [key: string]: number } = {}
for (const key in sceneData) {
  keyWeights[key] = sceneData[key as SceneKey].probability
}
