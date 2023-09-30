import { ServerWebSocket } from 'bun'
import * as c from '../../common'
import { MessageFromServerToUnity } from './MessageFromServerToUnity'

const pingIntervalMs = 1000 * 45

export class User {
  id: string
  rooms: Set<string> = new Set()
  webSocket: ServerWebSocket<SocketUserSessionData>

  pingInterval: ReturnType<typeof setInterval>

  constructor(
    id: string,
    webSocket: ServerWebSocket<SocketUserSessionData>,
  ) {
    this.id = id
    this.webSocket = webSocket

    this.pingInterval = setInterval(
      () => this.ping(),
      pingIntervalMs,
    )
  }

  ping() {
    if (!this.webSocketIsConnected) {
      clearInterval(this.pingInterval)
      return
    }
    this.webSocket.ping()
  }

  joinRoom(room: string, notifyOthers: boolean = true) {
    if (this.rooms.has(room)) {
      c.error(`User ${this.id} already in room ${room}!`)
      return
    }

    this.rooms.add(room)
    this.webSocket.subscribe(room)
    c.sub(`${this.id} has joined room ${room}`)
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

    c.sub(`${this.id} has left room ${room}`)
    this.sendToRoom({
      room,
      content: 'left',
    })
  }

  leaveAllRooms() {
    if (!this.webSocket) return
    for (let room of this.rooms) this.leaveRoom(room)
  }

  onBeforeRemove() {
    clearInterval(this.pingInterval)
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
        sender: this,
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
