import { DateTime, UUID } from '../../types/common'

export type INarrative = {
  id: UUID
  parentId: UUID
  title: string
  content: string
  createdAt: DateTime
  updatedAt: DateTime
}
