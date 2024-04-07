import { DateTime, UUID } from '../../types/common'

export type NewStory = {
  title: string
  content: string
  notes: string
  partsIds: UUID[]
  chaptersIds: UUID[]
}

export type IStory = NewStory & {
  id: UUID
  createdAt: DateTime
  updatedAt: DateTime
}
