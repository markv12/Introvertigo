import * as c from '../../common'
import type { User } from './User'

export class MessageFromServerToUnity<
  T extends keyof MessageFromServerToUnityTypeMap = 'debug',
> {
  readonly type: keyof MessageFromServerToUnityTypeMap
  readonly content: any
  readonly meta: MessageFromServerToUnityMetadata

  constructor({
    type,
    content,
    sender,
    room,
  }: {
    type?: T
    content: MessageFromServerToUnityTypeMap[T]
    sender?: User
    room?: string
  }) {
    this.type = type || 'debug'
    this.content = content
    this.meta = {
      timestamp: Date.now(),
    }
    if (sender)
      this.meta.sender = {
        id: sender.id,
      }
    if (room) this.meta.room = room
  }

  toJSON(): string {
    return JSON.stringify(c.stubify(this))
  }
}
