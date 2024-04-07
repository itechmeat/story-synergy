import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NewStory } from '../features/story/NewStory/NewStory'
import { buildEmptyStory } from '../features/story/constants'
// import useStoryStore from '../features/story/storyStore'
import { useStoryStore as useStoryStore2 } from '../features/story/storyStore'
import { IStory } from '../features/story/type'

export const StoryCreate = () => {
  const navigate = useNavigate()
  const { createStory } = useStoryStore2()

  const [newStory, setNewStory] = useState<IStory>(buildEmptyStory())

  const handleSave = useCallback(() => {
    createStory(newStory)
    navigate(`/stories/${newStory.id}`)
  }, [createStory, navigate, newStory])

  return (
    <div>
      <p>
        <Link to={'..'}>Back</Link>
      </p>
      <NewStory story={newStory} onUpdate={setNewStory} onSave={handleSave} />
    </div>
  )
}
