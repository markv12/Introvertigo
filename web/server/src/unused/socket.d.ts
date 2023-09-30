interface SocketUserSessionData {
  userId: string
}

interface MessageFromServerToUnityTypeMap {
  debug: string
  error: string
}

interface MessageFromServerToUnityMetadata {
  timestamp: number
  sender?: {
    id: string
  }
  room?: string
}
