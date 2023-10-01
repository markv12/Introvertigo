type SceneKey =
  | 'urinal'
  | 'car'
  | 'grandma'
  | 'train'
  | 'plane'
  | 'gym'

interface GameScene {
  key: SceneKey
  messages: GameMessage[]
}
interface GameSceneInitData extends GameScene {
  backstory: string
  requiredWords: string[]
  win: string
  lose: string
  loseRude: string
}

interface GameGPTResponse {
  reply: string
  messages: GameMessage[]
  rudeness: number
  rating: number
}
interface GameGPTResponseError {
  error: string
}

interface GameMessage {
  content: string
  role: 'system' | 'user' | 'assistant'
}

interface SceneGeneratorData {
  probability: number
  backstory: string
  userRequiredWords: string[]
  hiddenTriggerWords: string[]
  systemIntro: string
  firstMessage: string
  winMessages: string[]
  loseMessages: string[]
  loseRudeMessages: string[]
}
