import { FC, useCallback } from 'react'
import { Button } from '../../../components/Button/Button'
import { TextEditable } from '../../../components/TextEditable/TextEditable'
import { Title } from '../../../components/Title/Title'
import { Color } from '../../../types/ui'
import { IStory } from '../type'
import styles from './NewStory.module.scss'

type NewStoryProps = {
  story: IStory
  onUpdate: (story: IStory) => void
  onSave: () => void
}

export const NewStory: FC<NewStoryProps> = ({ story, onUpdate, onSave }) => {
  const handleChange = useCallback(
    (field: string, value: string) => {
      const result = {
        ...story,
        [field]: value,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
      onUpdate(result)
    },
    [onUpdate, story],
  )

  if (!story) return null

  return (
    <div>
      <Title text={story.title} editable onChange={text => handleChange('title', text)} />

      <TextEditable
        className={styles.content}
        text={story.content}
        editable
        onChange={text => handleChange('content', text)}
      />

      <footer>
        <Button color={Color.SUCCESS} onClick={onSave}>
          Start writing
        </Button>
      </footer>
    </div>
  )
}
