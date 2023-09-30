type SceneKey = 'urinal'

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
