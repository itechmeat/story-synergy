import Dexie, { Table } from 'dexie'
import { IChapter } from '../features/chapter/type'
import { INarrative } from '../features/narrative/type'
import { IPart } from '../features/part/type'
import { IScene } from '../features/scene/type'
import { IStory } from '../features/story/type'

const dbName = 'books'

interface IDexieDB extends Dexie {
  stories: Table<IStory>
  parts: Table<IPart>
}

class MyDexieDB extends Dexie implements IDexieDB {
  stories!: Table<IStory>
  parts!: Table<IPart>
  chapters!: Table<IChapter>
  scenes!: Table<IScene>
  narratives!: Table<INarrative>

  constructor() {
    super(dbName)
    this.version(1).stores({
      stories: '++id, id',
      parts: '++id, id, parentId, storyId',
      chapters: '++id, id, parentId, storyId',
      scenes: '++id, id, parentId, storyId',
      narratives: '++id, id, parentId, storyId',
    })
  }
}

export const localDB = new MyDexieDB()

export const clearDatabase = () => {
  Dexie.delete(dbName)
    .then(() => {
      console.log(`Database "${dbName}" deleted successfully.`)
    })
    .catch(error => {
      console.error(`Failed to delete database "${dbName}".`, error)
    })
}
