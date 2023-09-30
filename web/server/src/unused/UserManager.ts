import type { ServerWebSocket } from 'bun'
import * as c from '../../common'
import { User } from './User'
import type { WSServer } from './WSServer'

export class UserManager {
  readonly COMMON_ROOM: string

  private connectedUsers: {
    [key: string]: User
  } = {}

  constructor(server: WSServer) {
    this.COMMON_ROOM = `${server.id}-ws-allUsers`
  }

  getConnectedUsers() {
    return this.connectedUsers
  }

  getConnectedUser(userId: string) {
    return this.connectedUsers[userId]
  }

  addConnectedUser(
    ws: ServerWebSocket<SocketUserSessionData>,
  ): User {
    const user = new User(ws.data.userId, ws)
    this.connectedUsers[ws.data.userId] = user
    c.l(
      `👋 ${ws.data.userId} connected (${
        Object.keys(this.connectedUsers).length
      } total connected users)`,
    )
    user.joinRoom(this.COMMON_ROOM)
    return user
  }

  removeConnectedUser(userId: string) {
    if (!this.connectedUsers[userId]) return
    this.connectedUsers[userId].onBeforeRemove()
    delete this.connectedUsers[userId]
    c.sub(
      `🚪 ${userId} disconnected (${
        Object.keys(this.connectedUsers).length
      } total connected users)`,
    )
  }
}
