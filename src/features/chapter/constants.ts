import { nanoid } from 'nanoid'
import { UUID } from '../../types/common'
import { buildEditorValue } from '../editor/TipTapEditor/utils'
import { IChapter } from './type'

export const buildEmptyChapter = (num: number, parentId: UUID, storyId: UUID): IChapter => {
  const pubDate = new Date().toISOString()

  return {
    id: nanoid(),
    storyId,
    parentId,
    title: `Chapter ${num}`,
    content: buildEditorValue('Once upon a time...'),
    notes: '',
    createdAt: pubDate,
    updatedAt: pubDate,
    scenesIds: [],
  }
}
