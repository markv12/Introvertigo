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
