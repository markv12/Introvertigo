import type { WebSocketServeOptions } from 'bun'
import * as c from '../../common'
import { UserManager } from './UserManager'
import { MessageFromServerToUnity } from './MessageFromServerToUnity'

export class WSServer {
  id: string
  startedAt = Date.now()
  server: ReturnType<typeof Bun.serve>
  userManager: UserManager

  constructor({
    port = 5054,
    id,
  }: {
    port?: number
    id?: string
  }) {
    this.id = id || c.id('server')
    c.info(
      `Websocket server ${this.id} started at ${new Date(
        this.startedAt,
      ).toLocaleTimeString()} ${new Date(
        this.startedAt,
      ).toDateString()}`,
    )

    this.server = Bun.serve<SocketUserSessionData>({
      port,
      ...this.serverInitData,
    })

    this.userManager = new UserManager(this)

    c.info(
      `Websocket server ${this.id} listening on ${this.server.hostname}:${this.server.port}`,
    )
  }

  serverInitData: WebSocketServeOptions<SocketUserSessionData> =
    {
      fetch: async (req, server) => {
        const url = new URL(req.url)
        c.sub('req', url.pathname, url.searchParams)

        if (url.pathname.endsWith('/test'))
          return generateHTTPResponse(
            Bun.file('./test.html'),
          )

        if (url.pathname.endsWith('/ws')) {
          const userId = url.searchParams.get('userId')
          if (!userId)
            return generateHTTPResponse(
              'Missing userId',
              400,
            )

          const success = server.upgrade(req, {
            data: { userId },
          })
          if (success) return undefined
          else
            return generateHTTPResponse(
              'WebSocket upgrade error',
              400,
            )
        }

        // * fallback to any other request
        return generateHTTPResponse(
          c.msToTimeString(Date.now() - this.startedAt) +
            ' since server started',
        )
      },

      websocket: {
        perMessageDeflate: true,

        open: (ws) => {
          if (
            this.userManager.getConnectedUser(
              ws.data.userId,
            )
          ) {
            ws.send(
              new MessageFromServerToUnity<'error'>({
                content: `User ${ws.data.userId} already connected`,
              }).toJSON(),
            )
            ws.close()
            return
          }

          this.userManager.addConnectedUser(ws)
        },

        message: (ws, message) => {
          const user = this.userManager.getConnectedUser(
            ws.data.userId,
          )
          if (!user) {
            ws.send(
              new MessageFromServerToUnity<'error'>({
                content: `User ${ws.data.userId} not connected`,
              }).toJSON(),
            )
            ws.close()
            return
          }

          c.sub(
            `${
              ws.data.userId
            }: "${message}" -> ${c.printList(
              Array.from(user.rooms),
            )}`,
          )
          user.sendToAllRooms({
            content: `${ws.data.userId}: ${message}`,
          })
          user.sendToSelf({
            content: `message received and sent to ${user.rooms.size} room/s: "${message}"`,
          })
        },

        close: (ws) => {
          this.userManager.removeConnectedUser(
            ws.data.userId,
          )
        },
      },
    }
}

const generateHTTPResponse = (
  message: ConstructorParameters<typeof Response>[0],
  status?: number,
): Response => {
  const options: ResponseInit | undefined = status
    ? { status }
    : undefined
  const res = new Response(message, options)
  applyCorsToHTTPResponse(res)
  return res
}

const applyCorsToHTTPResponse = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
}
