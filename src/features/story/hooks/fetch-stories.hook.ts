import { useEffectOnce } from 'react-use'
import { useStoryStore } from '../storyStore'

export const useFetchFullStories = () => {
  const { fetchAllStories } = useStoryStore()

  useEffectOnce(() => {
    fetchAllStories()
  })
}
