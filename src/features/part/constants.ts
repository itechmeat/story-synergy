import { nanoid } from 'nanoid'
import { UUID } from '../../types/common'
import { IPart } from './type'

export const buildEmptyPart = (num: number, parentId: UUID): IPart => {
  const pubDate = new Date().toISOString()

  return {
    id: nanoid(),
    parentId,
    title: `Part ${num}`,
    content: 'Once upon a time...',
    notes: '',
    createdAt: pubDate,
    updatedAt: pubDate,
    chaptersIds: [],
  }
}
