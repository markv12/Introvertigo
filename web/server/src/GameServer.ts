import type { ServeOptions } from 'bun'
import * as c from '../../common'
import generateScene from './generateScene'
import getGameResponse from './getGameResponse'

export class GameServer {
  id: string
  startedAt = Date.now()
  server: ReturnType<typeof Bun.serve>

  constructor({
    port = 5054,
    id,
  }: {
    port?: number
    id?: string
  }) {
    this.id = id || c.id('server')
    c.info(
      `Rest server ${this.id} started at ${new Date(
        this.startedAt,
      ).toLocaleTimeString()} ${new Date(
        this.startedAt,
      ).toDateString()}`,
    )

    this.server = Bun.serve({
      port,
      ...this.serverInitData,
    })

    c.info(
      `Rest server ${this.id} listening on ${this.server.hostname}:${this.server.port}`,
    )
  }

  serverInitData: ServeOptions = {
    fetch: async (req, server) => {
      const url = new URL(req.url)
      c.sub(
        'Received request to',
        url.pathname,
        url.searchParams,
      )

      if (url.pathname.endsWith('/ping'))
        return generateHTTPResponse(`pong`)

      if (url.pathname.includes('/getscenario')) {
        const key = url.searchParams.get('key') as
          | SceneKey
          | undefined
        return generateHTTPResponse(
          JSON.stringify(await generateScene(key)),
        )
      }

      if (
        req.method === 'POST' &&
        url.pathname.endsWith('/response')
      ) {
        const stream = req.body as ReadableStream<{
          messages: GameMessage[]
        }>
        let bodyAsText = await Bun.readableStreamToText(
          stream,
        )
        bodyAsText = bodyAsText.replace(/^messages=/, '')
        try {
          bodyAsText = decodeURIComponent(bodyAsText)
        } catch (e) {}

        c.log(`got body`, bodyAsText)
        try {
          let body:
            | { messages: GameMessage[] }
            | undefined = JSON.parse(bodyAsText)
          if (!body?.messages?.length) {
            return generateHTTPResponse(
              `invalid body value`,
              400,
            )
          }
          c.log(`parsed body`, body)

          return generateHTTPResponse(
            JSON.stringify(
              '{' +
                (await getGameResponse(body.messages)) +
                '}',
            ),
          )
        } catch (e) {
          c.error(e, await Bun.readableStreamToText(stream))
          return generateHTTPResponse(
            JSON.stringify({ error: 'invalid json' }),
            400,
          )
        }
      }

      // * fallback to any other request
      return generateHTTPResponse(
        c.msToTimeString(Date.now() - this.startedAt) +
          ' since server started',
      )
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
