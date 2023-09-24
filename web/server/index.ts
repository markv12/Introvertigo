import type { WebSocketServeOptions } from 'bun'
import * as c from '../common'

const startedAt = Date.now()
c.l(
  'green',
  `Server started at ${new Date(
    startedAt,
  ).toLocaleTimeString()} ${new Date(
    startedAt,
  ).toDateString()}`,
)

interface SocketInitData {
  userId: string
  room: string
}

const serverInitData: WebSocketServeOptions<SocketInitData> =
  {
    port: 5054,
    async fetch(req, server) {
      const url = new URL(req.url)
      c.l('req', url.pathname, url.searchParams)

      if (url.pathname === '/ld54/test')
        return generateResponse(Bun.file('./test.html'))

      if (url.pathname === '/ld54/ws') {
        const userId = url.searchParams.get('userId')
        if (!userId)
          return generateResponse('Missing userId', 400)

        const room = 'ws-room-1'
        const success = server.upgrade(req, {
          data: { userId, room },
        })
        if (success) return undefined
        else
          return generateResponse(
            'WebSocket upgrade error',
            400,
          )
      }

      return generateResponse(
        c.msToTimeString(Date.now() - startedAt) +
          ' since server started',
      )
    },

    websocket: {
      perMessageDeflate: true,

      open(ws) {
        const msg = `${ws.data.userId} has joined ${ws.data.room}`
        c.l(msg)
        ws.subscribe(ws.data.room)
        ws.publish(ws.data.room, msg)
        ws.send('welcome!')
      },

      message(ws, message) {
        c.l(`${ws.data.userId}: ${message}`)
        ws.publish(
          ws.data.room,
          `${ws.data.userId}: ${message}`,
        )
        ws.send('message received!')
      },

      close(ws) {
        const msg = `${ws.data.userId} has left ${ws.data.room}`
        c.l(msg)
        server.publish(ws.data.room, msg)
        ws.unsubscribe(ws.data.room)
      },
    },
  }

const generateResponse = (
  message: ConstructorParameters<typeof Response>[0],
  status?: number,
): Response => {
  const options: ResponseInit | undefined = status
    ? { status }
    : undefined
  const res = new Response(message, options)
  applyCors(res)
  return res
}

const applyCors = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
}

const server = Bun.serve<SocketInitData>(serverInitData)
c.l(`Listening on ${server.hostname}:${server.port}`)
