import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useChapterStore from '../features/chapter/chapterStore'
import usePartStore from '../features/part/partStore'
import { Story } from '../features/story/Story/Story'
import { useFetchFullStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'

export const StoryPage = () => {
  useFetchFullStories()
  const storyId = useParams().storyId
  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)
  const { fetchAllPartsByStoryId } = usePartStore()
  const { fetchAllChaptersByStoryId } = useChapterStore()

  useEffect(() => {
    if (storyId) {
      fetchAllPartsByStoryId(storyId)
      fetchAllChaptersByStoryId(storyId)
    }
  }, [fetchAllChaptersByStoryId, fetchAllPartsByStoryId, storyId])

  if (!story) return <div>Story not found</div>

  return <Story story={story} />
}
