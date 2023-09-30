import * as c from '../../common'
import sceneData, { getInitialMessages } from './sceneData'

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

const keyWeights: { [key: string]: number } = {}
for (const key in sceneData) {
  keyWeights[key] = sceneData[key as SceneKey].probability
}
