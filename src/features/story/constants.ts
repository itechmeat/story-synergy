import { nanoid } from 'nanoid'
import { IStory } from './type'

export const buildEmptyStory = (): IStory => {
  const pubDate = new Date().toISOString()

  return {
    id: nanoid(),
    title: 'New Story',
    content: 'Once upon a time...',
    notes: '',
    createdAt: pubDate,
    updatedAt: pubDate,
    partsIds: [],
    chaptersIds: [],
  }
}
