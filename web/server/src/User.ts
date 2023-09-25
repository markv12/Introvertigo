import { ServerWebSocket } from 'bun'
import * as c from '../../common'
import { MessageFromServerToUnity } from './MessageFromServerToUnity'

export class User {
  id: string
  rooms: Set<string> = new Set()
  webSocket: ServerWebSocket<SocketUserSessionData>

  constructor(
    id: string,
    webSocket: ServerWebSocket<SocketUserSessionData>,
  ) {
    this.id = id
    this.webSocket = webSocket
  }

  joinRoom(room: string, notifyOthers: boolean = true) {
    if (this.rooms.has(room)) {
      c.error(`User ${this.id} already in room ${room}!`)
      return
    }

    this.rooms.add(room)
    this.webSocket.subscribe(room)
    const msg = `${this.id} has joined room ${room}`
    c.sub(msg)
    if (notifyOthers)
      this.sendToRoom({
        room,
        content: 'connected',
      })
    this.sendToSelf({
      content: `welcome!`,
    })
  }

  joinRooms(rooms: string[]) {
    if (this.webSocket) {
      for (let room of rooms) this.joinRoom(room)
    }
  }

  leaveRoom(room: string, notifyOthers: boolean = true) {
    if (!this.webSocket) return
    if (!this.rooms.has(room)) {
      c.error(`User ${this.id} not in room ${room}!`)
      return
    }

    this.webSocket.unsubscribe(room)

    const msg = `${this.id} has left room ${room}`
    c.sub(msg)
    this.sendToRoom({
      room,
      content: msg,
    })
  }

  leaveAllRooms() {
    if (!this.webSocket) return
    for (let room of this.rooms) this.leaveRoom(room)
  }

  onBeforeRemove() {
    this.leaveAllRooms()
    this.webSocket.close()
  }

  get webSocketIsConnected() {
    return this.webSocket?.readyState === 1
  }

  sendToSelf<
    T extends keyof MessageFromServerToUnityTypeMap = 'debug',
  >({
    type,
    content,
  }: {
    type?: T
    content: MessageFromServerToUnityTypeMap[T]
  }) {
    if (!this.webSocketIsConnected) return
    this.webSocket.send(
      new MessageFromServerToUnity({
        type,
        content,
        user: this,
      }).toJSON(),
    )
  }

  sendToRoom<
    T extends keyof MessageFromServerToUnityTypeMap = 'debug',
  >({
    type,
    content,
    room,
  }: {
    type?: T
    content: MessageFromServerToUnityTypeMap[T]
    room: string
  }) {
    if (!this.webSocketIsConnected) return
    if (!this.rooms.has(room)) {
      c.error(
        `User ${this.id} not in room ${room} to send a message!`,
      )
      return
    }

    this.webSocket.publish(
      room,
      new MessageFromServerToUnity({
        type,
        content,
        user: this,
        room,
      }).toJSON(),
    )
  }

  sendToAllRooms<
    T extends keyof MessageFromServerToUnityTypeMap = 'debug',
  >({
    type,
    content,
  }: {
    type?: T
    content: MessageFromServerToUnityTypeMap[T]
  }) {
    for (let room of this.rooms) {
      this.sendToRoom({
        type,
        content,
        room,
      })
    }
  }
}
