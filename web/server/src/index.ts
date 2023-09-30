import * as c from '../../common'
import { GameServer } from './GameServer'
import generateScene from './generateScene'

const gameServer = new GameServer({ id: 'ld54' })

// import storage from './storage'
// const wsServer = new WSServer({ id: 'ld54' })

await c.sleep(1000)

await fetch(`http://localhost:5054/response`, {
  method: 'POST',
  body: JSON.stringify({
    messages: [
      ...generateScene().messages,
      {
        content: `Oh howdy!`,
        role: 'user',
      },
    ],
  }),
}).then(async (res) => c.log(await res.json()))
