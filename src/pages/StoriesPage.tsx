import { Trash } from '@phosphor-icons/react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import useChapterStore from '../features/chapter/chapterStore'
import usePartStore from '../features/part/partStore'
import { useFetchFullStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'

export const StoriesPage = () => {
  useFetchFullStories()
  const { getAllStories, deleteStory } = useStoryStore()
  const stories = getAllStories()
  const { fetchAllPartsByStoryId } = usePartStore()
  const { fetchAllChaptersByStoryId } = useChapterStore()

  const handleDeleteStory = async (storyId: string) => {
    await deleteStory(storyId)
    fetchAllPartsByStoryId(storyId)
    fetchAllChaptersByStoryId(storyId)
  }

  if (!stories) return null

  return (
    <div>
      <p>
        <Link to="create">Create new story</Link>
      </p>

      {stories.length > 0 && (
        <ul>
          {stories.map(story => (
            <li key={story.id}>
              <Link to={story.id}>{story.title} </Link>
              <Button
                icon={<Trash size={16} />}
                type="primary"
                size="small"
                danger
                onClick={() => handleDeleteStory(story.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
