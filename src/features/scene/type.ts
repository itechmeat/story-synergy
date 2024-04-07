import { DateTime, UUID } from '../../types/common'
import { INarrative } from '../narrative/type'

export type IScene = {
  id: UUID
  title: string
  content: string
  notes: string
  createdAt: DateTime
  updatedAt: DateTime
  narrativesIds: INarrative
}
