import type { TLSWebSocketServeOptions } from 'bun'

interface SocketInitData {
  userId: string
  room: string
}

const serverInitData: TLSWebSocketServeOptions<SocketInitData> =
  {
    port: 5054,
    async fetch(req, server) {
      const url = new URL(req.url)
      console.log('req', url.pathname, url.searchParams)

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

      return generateResponse('index')
    },

    websocket: {
      perMessageDeflate: true,

      open(ws) {
        const msg = `${ws.data.userId} has joined ${ws.data.room}`
        console.log(msg)
        ws.subscribe(ws.data.room)
        ws.publish(ws.data.room, msg)
        ws.send('welcome!')
      },

      message(ws, message) {
        console.log(`${ws.data.userId}: ${message}`)
        ws.publish(
          ws.data.room,
          `${ws.data.userId}: ${message}`,
        )
        ws.send('message received!')
      },

      close(ws) {
        const msg = `${ws.data.userId} has left ${ws.data.room}`
        console.log(msg)
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

// if (process.env.NODE_ENV === 'production') {
//   serverInitData.tls = {
//     key: Bun.file('/etc/letsencrypt/live/p.jasperstephenson.com/privkey.pem'),
//     cert: Bun.file('/etc/letsencrypt/live/p.jasperstephenson.com/fullchain.pem'),
//   }
// }

const server = Bun.serve<SocketInitData>(serverInitData)
console.log(
  `Listening on ${server.hostname}:${server.port}`,
)
