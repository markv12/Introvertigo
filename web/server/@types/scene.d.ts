type SceneKey = 'urinal' | 'car' | 'grandma' | 'train'

interface GameScene {
  key: SceneKey
  messages: GameMessage[]
}
interface GameSceneInitData extends GameScene {
  backstory: string
  requiredWords: string[]
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
  ratingCondition: string
  userRequiredWords: string[]
  hiddenTriggerWords: string[]
  systemIntro: string
  firstMessage: string
}
