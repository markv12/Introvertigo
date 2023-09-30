import * as c from '../../common'
import sceneData from './sceneData'

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

function getInitialMessages(key: SceneKey) {
  const messages: GameMessage[] = []
  messages.push({
    content:
      sceneData[key].systemIntro +
      ` Always keep the energy up and keep asking questions! NEVER apologize for bothering them or back down. If the topics of ${c.printList(
        sceneData[key].hiddenTriggerWords,
        'or',
      )} are mentioned you will get very excited, but you won't bring them up yourself.

You MUST respond to every message in this three line format:
- (answer with Yes, No, or Meh) Was the user's response rude?
- (answer with Yes, No, or Meh) ${
        sceneData[key].ratingCondition
      }
- Finally, respond in 1-2 sentences.

EXAMPLE RESPONSE:
Meh
Yes
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
