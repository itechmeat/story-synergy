import { create } from 'zustand'
import { createJSONStorage, devtools } from 'zustand/middleware'
import { localDB } from '../../api/db'
import { UUID } from '../../types/common'
import { IPart } from './type'

type PartState = {
  parts: IPart[]
  activePartId: UUID | null
  editablePartId: UUID | null
  fetchAllPartsByStoryId: (storyId: UUID) => Promise<IPart[] | undefined>
  createPart: (part: IPart) => void
  updatePart: (id: UUID, updatedFields: Partial<IPart>) => void
  deletePart: (id: UUID) => void
  getPartById: (id?: UUID | null) => IPart | null
  getPartByChapterId: (id?: UUID | null) => IPart | null
  getAllParts: () => IPart[]
  setActivePartId: (id: UUID | null) => void
  setEditablePartId: (id: UUID | null) => void
}

export const usePartStore = create<PartState>()(
  devtools(
    (set, get) => ({
      parts: [],
      activePartId: null,
      editablePartId: null,
      fetchAllPartsByStoryId: async (storyId: UUID) => {
        try {
          const parts = await localDB.parts.where('parentId').equals(storyId).toArray()
          set({
            parts: [...parts],
          })
          return parts
        } catch (err) {
          console.error('fetchAllPartsByStoryId:', err)
        }
      },
      createPart: async (part: IPart) => {
        try {
          set(state => ({
            parts: [...state.parts, part],
          }))
          await localDB.parts.add(part)
          return part
        } catch (err) {
          console.error('createPart:', err)
        }
      },
      updatePart: async (partId, updatedFields) => {
        try {
          set(state => ({
            parts: state.parts.map(part =>
              part.id === partId
                ? { ...part, ...updatedFields, updatedAt: new Date().toISOString() }
                : part,
            ),
          })),
            await localDB.parts.update(partId, updatedFields)
        } catch (err) {
          console.error('updatePart:', err)
        }
      },
      deletePart: async partId => {
        try {
          set(state => ({
            parts: state.parts.filter(part => part.id !== partId),
          }))
          await localDB.parts.delete(partId)
        } catch (err) {
          console.error('deletePart:', err)
        }
      },
      getPartById: id => {
        if (!id) return null
        const { parts } = get()
        return parts.find(part => part.id === id) || null
      },
      getPartByChapterId: id => {
        if (!id) return null
        const { parts } = get()
        return parts.find(part => part.chaptersIds?.includes(id)) || null
      },
      getAllParts: () => {
        const { parts } = get()
        return parts
      },
      setActivePartId: id => {
        set({ activePartId: id })
      },
      setEditablePartId: id => {
        set({ editablePartId: id })
      },
    }),
    {
      name: 'parts-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default usePartStore
