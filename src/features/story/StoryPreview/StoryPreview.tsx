import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import useChapterStore from '../../chapter/chapterStore'
import { TipTapEditor } from '../../editor/TipTapEditor/TipTapEditor'
import { IStory } from '../type'
import styles from './StoryPreview.module.scss'

type Props = {
  story: IStory
}

export const StoryPreview: FC<Props> = ({ story }) => {
  const { getChapterById } = useChapterStore()

  if (!story) return null

  return (
    <div className={styles.preview}>
      {story.chaptersIds.map(chapterId => {
        const chapter = getChapterById(chapterId)
        if (!chapter) return null
        return (
          <div key={chapter.id}>
            <h2 className={styles.header}>
              {chapter.title} (<NavLink to={`/stories/${story.id}/${chapterId}`}>edit</NavLink>)
            </h2>
            <div>
              <TipTapEditor key={chapter.id} editable={false} content={chapter.content} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
