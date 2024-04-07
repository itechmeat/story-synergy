import { DateTime, UUID } from '../../types/common'

export type IPart = {
  id: UUID
  parentId: UUID
  title: string
  content: string
  notes: string
  createdAt: DateTime
  updatedAt: DateTime
  chaptersIds: UUID[]
}
