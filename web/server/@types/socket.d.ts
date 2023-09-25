interface SocketUserSessionData {
  userId: string
}

interface MessageFromServerToUnityTypeMap {
  debug: string
  error: string
}

interface MessageFromServerToUnityMetadata {
  timestamp: number
  user?: {
    id: string
  }
  room?: string
}
