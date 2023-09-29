import {
  Storage,
  StorageValue,
  createStorage,
} from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import path from 'path'

const storage: Storage<StorageValue> = createStorage({
  driver: fsDriver({
    base: path.join(__dirname, '../', 'data'),
  }),
})

// before process termination
process.on('SIGINT', () => {
  storage.dispose()
})

export default storage
