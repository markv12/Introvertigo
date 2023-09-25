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
    user,
    room,
  }: {
    type?: T
    content: MessageFromServerToUnityTypeMap[T]
    user?: User
    room?: string
  }) {
    this.type = type || 'debug'
    this.content = content
    this.meta = {
      timestamp: Date.now(),
    }
    if (user)
      this.meta.user = {
        id: user.id,
      }
    if (room) this.meta.room = room
  }

  toJSON(): string {
    return JSON.stringify(c.stubify(this))
  }
}
