import * as c from '../../common'
import { GameServer } from './GameServer'
import generateScene from './generateScene'

const gameServer = new GameServer({ id: 'ld54' })

// import storage from './storage'
// const wsServer = new WSServer({ id: 'ld54' })

// await c.sleep(1000)
// c.log(
//   await fetch(`http://localhost:5054/response`, {
//     method: 'POST',
//     body: JSON.stringify([
//       ...generateScene().messages,
//       {
//         content: `FUCK you fucking scared the fuck out of me get the FUCK away from me, creep`,
//         role: 'user',
//       },
//     ]),
//   }).then((r) => r.text()),
// )
