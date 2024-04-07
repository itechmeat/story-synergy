import { create } from 'zustand'
import { createJSONStorage, devtools } from 'zustand/middleware'
import { localDB } from '../../api/db'
import { UUID } from '../../types/common'
import { IChapter } from './type'

type ChapterState = {
  chapters: IChapter[]
  activeChapterId: UUID | null
  editableChapterId: UUID | null
  fetchAllChaptersByStoryId: (storyId: UUID) => Promise<IChapter[] | undefined>
  createChapter: (chapter: IChapter) => void
  updateChapter: (id: UUID, updatedFields: Partial<IChapter>) => void
  deleteChapter: (id: UUID) => void
  getChapterById: (id: UUID) => IChapter | undefined
  getAllChapters: () => IChapter[]
  getChaptersByIds: (ids: UUID[]) => IChapter[]
  setActiveChapterId: (id: UUID | null) => void
  setEditableChapterId: (id: UUID | null) => void
}

export const useChapterStore = create<ChapterState>()(
  devtools(
    (set, get) => ({
      chapters: [],
      activeChapterId: null,
      editableChapterId: null,
      fetchAllChaptersByStoryId: async (storyId: UUID) => {
        try {
          const chapters = await localDB.chapters.where('storyId').equals(storyId).toArray()
          set({
            chapters: [...chapters],
          })
          return chapters
        } catch (err) {
          console.error('fetchAllChaptersByStoryId:', err)
        }
      },
      createChapter: async (chapter: IChapter) => {
        try {
          set(state => ({
            chapters: [...state.chapters, chapter],
          }))
          await localDB.chapters.add(chapter)
        } catch (err) {
          console.error('createChapter:', err)
        }
      },
      updateChapter: async (id, updatedFields) => {
        try {
          set(state => ({
            chapters: state.chapters.map(chapter =>
              chapter.id === id
                ? { ...chapter, ...updatedFields, updatedAt: new Date().toISOString() }
                : chapter,
            ),
          })),
            await localDB.chapters.update(id, updatedFields)
        } catch (err) {
          console.error('updateChapter:', err)
        }
      },
      deleteChapter: async chapterId => {
        try {
          set(state => ({
            chapters: state.chapters.filter(chapter => chapter.id !== chapterId),
          }))
          await localDB.chapters.delete(chapterId)
        } catch (err) {
          console.error('deleteChapter:', err)
        }
      },
      getChapterById: id => {
        const { chapters } = get()
        return chapters.find(chapter => chapter.id === id)
      },
      getChaptersByIds: ids => {
        const { chapters } = get()
        return chapters.filter(chapter => ids.includes(chapter.id))
      },
      getAllChapters: () => {
        const { chapters } = get()
        return chapters
      },
      setActiveChapterId: id => {
        set({ activeChapterId: id })
      },
      setEditableChapterId: id => {
        set({ editableChapterId: id })
      },
    }),
    {
      name: 'chapters-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useChapterStore
