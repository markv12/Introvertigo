import * as c from '../../common'
import sceneData, { getInitialMessages } from './sceneData'

export default function generateScene(
  forceKey?: SceneKey,
): GameSceneInitData {
  const key =
    forceKey ||
    (c.randomWithWeights(keyWeights) as SceneKey)

  const backstory = sceneData[key].backstory
  const requiredWords = sceneData[key].userRequiredWords

  const scene: GameSceneInitData = {
    key,
    backstory,
    messages: getInitialMessages(key),
    requiredWords,
    win: c.randomFromArray(sceneData[key].winMessages),
    lose: c.randomFromArray(sceneData[key].loseMessages),
    loseRude: c.randomFromArray(
      sceneData[key].loseRudeMessages,
    ),
  }
  return scene
}

const keyWeights: { [key: string]: number } = {}
for (const key in sceneData) {
  keyWeights[key] = sceneData[key as SceneKey].probability
}
