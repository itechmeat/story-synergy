import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { clearDatabase, localDB } from '../../api/db'
import { UUID } from '../../types/common'
import { IStory } from './type'

type StoryState = {
  stories: IStory[]
  activeStoryId: UUID | null
  editableStoryId: UUID | null
  fetchAllStories: () => Promise<IStory[] | undefined>
  fetchStoryById: (id: UUID) => Promise<IStory | undefined>
  createStory: (story: IStory) => void
  updateStory: (id: UUID, updatedFields: Partial<IStory>) => void
  deleteStory: (id: UUID) => void
  getAllStories: () => IStory[]
  getStoryById: (id?: UUID | null) => IStory | null
  setActiveStoryId: (id: UUID | null) => void
  setEditableStoryId: (id: UUID | null) => void
  clearDB: () => void
}

export const useStoryStore = create<StoryState>()(
  devtools((set, get) => ({
    stories: [],
    activeStoryId: null,
    editableStoryId: null,
    fetchAllStories: async () => {
      try {
        const stories = await localDB.stories.toArray()
        set({
          stories: [...stories],
        })
        return stories
      } catch (err) {
        console.error('fetchAllStories:', err)
      }
    },
    fetchStoryById: async (id: UUID) => {
      try {
        const story = await localDB.stories.get(id)
        if (story) {
          set(state => ({
            stories: [...state.stories, story],
          }))
          return story
        }
      } catch (err) {
        console.error('fetchStoryById:', err)
      }
    },
    createStory: async (story: IStory) => {
      try {
        set(state => ({
          stories: [...state.stories, story],
        }))
        await localDB.stories.add(story)
      } catch (err) {
        console.error('createStory:', err)
      }
    },
    updateStory: async (storyId, updatedFields) => {
      try {
        set(state => ({
          stories: state.stories.map(story =>
            story.id === storyId
              ? { ...story, ...updatedFields, updatedAt: new Date().toISOString() }
              : story,
          ),
        }))
        await localDB.stories.update(storyId, updatedFields)
      } catch (err) {
        console.error('updateStory:', err)
      }
    },
    deleteStory: async storyId => {
      try {
        const { stories } = get()
        const story = stories.find(story => story.id === storyId) || null

        set(state => ({
          stories: state.stories.filter(story => story.id !== storyId),
        }))

        if (story?.partsIds) {
          await Promise.all(story.partsIds.map(partsId => localDB.parts.delete(partsId)))
        }
        if (story?.chaptersIds) {
          await Promise.all(story.chaptersIds.map(chapterId => localDB.chapters.delete(chapterId)))
        }

        await localDB.stories.delete(storyId)
      } catch (err) {
        console.error('deleteStory:', err)
      }
    },
    getAllStories: () => {
      const { stories } = get()
      return stories
    },
    getStoryById: storyId => {
      if (!storyId) return null
      const { stories } = get()
      return stories.find(story => story.id === storyId) || null
    },
    setActiveStoryId: storyId => {
      set({ activeStoryId: storyId })
    },
    setEditableStoryId: storyId => {
      set({ editableStoryId: storyId })
    },
    clearDB: () => {
      clearDatabase()
    },
  })),
)
