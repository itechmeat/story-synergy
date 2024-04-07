import { DateTime, UUID } from '../../types/common'
import { TipTapContent } from '../editor/TipTapEditor/TipTapEditor'

export type IChapter = {
  id: UUID
  storyId: UUID
  parentId: UUID
  title: string
  content: TipTapContent
  notes: string
  createdAt: DateTime
  updatedAt: DateTime
  scenesIds: UUID[]
  activeScene?: UUID
}
