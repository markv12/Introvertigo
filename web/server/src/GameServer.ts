import type { ServeOptions } from 'bun'
import * as c from '../../common'
import generateScene from './generateScene'
import getGameResponse from './getGameResponse'
import sceneData from './sceneData'

export class GameServer {
  id: string
  startedAt = Date.now()
  server: ReturnType<typeof Bun.serve>
  requestCounts = {} as Record<string, number>

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
      this.requestCounts[url.pathname] =
        (this.requestCounts[url.pathname] || 0) + 1
      const hoursActive =
        (Date.now() - this.startedAt) / 1000 / 60 / 60
      const perHour = c.r2(
        this.requestCounts[url.pathname] / hoursActive,
      )
      if (req.method !== 'OPTIONS')
        c.sub(
          `${req.method} ${
            url.pathname
          } (${perHour}/hr in ${c.r2(hoursActive)} hrs)`,
        )

      if (url.pathname.endsWith('/ping'))
        return generateHTTPResponse(`pong`)

      if (url.pathname.endsWith('/keys'))
        return generateHTTPResponse(
          Object.keys(sceneData).join(','),
        )

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
        url.pathname.includes('/response')
      ) {
        const pw = url.pathname.split('/response').pop()
        c.l(url, pw, pw === process.env.GAME_PASSWORD)
        const startedAt = Date.now()
        const stream = req.body as ReadableStream<{
          messages: GameMessage[]
        }>
        try {
          let bodyAsText = await Bun.readableStreamToText(
            stream,
          )
          bodyAsText = bodyAsText.replace(/^messages=/, '')

          try {
            bodyAsText = decodeURIComponent(bodyAsText)
          } catch (e) {
            c.sub('uri decode unnecessary')
          }

          // c.log(`got body`, bodyAsText)
          try {
            let body:
              | { messages: GameMessage[] }
              | undefined = JSON.parse(bodyAsText)

            // c.log(`parsed body`, body)

            if (!body?.messages?.length) {
              return generateHTTPResponse(
                `invalid body value`,
                400,
              )
            }

            const gameResponse = await getGameResponse(
              body?.messages,
            )
            c.sub(
              `got response in ${c.msToTimeString(
                Date.now() - startedAt,
              )}`,
            )
            return generateHTTPResponse(
              JSON.stringify(gameResponse),
            )
          } catch (e) {
            c.error(e)
            return generateHTTPResponse(
              JSON.stringify({ error: 'invalid json' }),
              400,
            )
          }
        } catch (e) {
          c.error(e)
          return generateHTTPResponse(
            JSON.stringify({ error: 'invalid body' }),
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
  const options: ResponseInit = status ? { status } : {}
  options.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':
      'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  const res = new Response(message, options)
  return res
}
