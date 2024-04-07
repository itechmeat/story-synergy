/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useMemo } from 'react'
import cn from 'classnames'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { Title } from '../../../components/Title/Title'
import { UUID } from '../../../types/common'
import { ChapterEditor } from '../../chapter/ChapterEditor/ChapterEditor'
import useChapterStore from '../../chapter/chapterStore'
import { buildEmptyChapter } from '../../chapter/constants'
import { Sidebar } from '../../layout/Sidebar/Sidebar'
import { useLayoutStore } from '../../layout/layoutStore'
import { AddPartButton } from '../../part/AddPartButton/AddPartButton'
import { buildEmptyPart } from '../../part/constants'
import usePartStore from '../../part/partStore'
import { StartStory } from '../StartStory/StartStory'
import { StoryMenu } from '../StoryMenu/StoryMenu'
import { StoryPreview } from '../StoryPreview/StoryPreview'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './Story.module.scss'

type StoryProps = {
  story: IStory
}

type MenuItem = {
  id: string
  name: string
}

export const Story: FC<StoryProps> = ({ story }) => {
  const contentId = useParams().contentId as UUID

  const navigate = useNavigate()
  const { updateStory } = useStoryStore()
  const { createPart, getPartById, updatePart } = usePartStore()
  const { createChapter, getChapterById, updateChapter } = useChapterStore()
  const { isMenuOpened } = useLayoutStore()

  const { width: windowWidth } = useWindowSize()

  const activePart = getPartById(contentId)
  const activeChapter = getChapterById(contentId)
  const activePartByChapter = activeChapter ? getPartById(activeChapter.parentId) : null
  const activeContent = activePart || activeChapter

  const partsList = useMemo((): MenuItem[] => {
    if (!story.partsIds?.length) return []
    return story.partsIds
      .map(partId => {
        const p = getPartById(partId)
        if (!p) return
        return { id: p.id, name: p.title }
      })
      .filter(Boolean) as MenuItem[]
  }, [getPartById, story.partsIds])

  const addNewPart = (index = 0) => {
    if (!story) return
    const newPart = buildEmptyPart(story.partsIds?.length + 1 || 1, story.id)
    const partsIds = [...(story.partsIds || [])]
    partsIds.splice(index, 0, newPart.id)
    updateStory(story.id, {
      ...story,
      partsIds,
    })
    createPart(newPart)
    navigate(`/stories/${story.id}/${newPart.id}`)
  }

  const addNewChapter = (index = 0, partId?: string) => {
    const part = getPartById(partId) || activePart
    if (!part) return
    const newChapter = buildEmptyChapter(part.chaptersIds?.length + 1 || 1, part.id, story.id)
    const chaptersIds = [...(part.chaptersIds || [])]
    chaptersIds.splice(index, 0, newChapter.id)
    updateStory(story.id, {
      ...story,
      chaptersIds,
    })
    updatePart(part.id, {
      ...part,
      chaptersIds,
    })
    createChapter(newChapter)
    navigate(`/stories/${story.id}/${newChapter.id}`)
  }

  const handleUpdate = useCallback(
    (title: string) => {
      if (activePart) {
        updatePart(activePart.id, { title })
        return
      }

      if (activeChapter) {
        updateChapter(activeChapter.id, { title })
        return
      }

      updateStory(story.id, { ...story, title })
    },
    [activeChapter, activePart, story, updateChapter, updatePart, updateStory],
  )

  if (!story) return null

  return (
    <div className={styles.story}>
      {(isMenuOpened || windowWidth >= 800) && (
        <Sidebar>
          {!!partsList.length && (
            <div className={styles.menu}>
              <StoryMenu
                story={story}
                expandedKeys={[activePart?.id || '']}
                onAddChapter={addNewChapter}
              />
            </div>
          )}
          {!story.partsIds?.length ? (
            <div className={styles.empty}>
              <AddPartButton onClick={() => addNewPart(0)}>Create the first part</AddPartButton>
            </div>
          ) : (
            <AddPartButton onClick={() => addNewPart(story.partsIds.length)}>
              Add next part
            </AddPartButton>
          )}
          <div className={cn(styles.sidebarShadow, styles.sidebarShadowReverted)} />
        </Sidebar>
      )}

      <section className={styles.content}>
        {activeContent && (
          <div className={styles.runningHead}>
            <NavLink to=".." className={styles.runningHeadLink}>
              {story.title}
            </NavLink>
            {!!activePartByChapter && (
              <>
                /
                <NavLink to={`../${activePartByChapter.id}`} className={styles.runningHeadLink}>
                  {activePartByChapter.title}
                </NavLink>
              </>
            )}
          </div>
        )}
        <header>
          <Title
            className={styles.title}
            text={activeChapter?.title || activeContent?.title || story.title}
            editable
            onChange={handleUpdate}
          />
        </header>

        {!activeContent && <div className={styles.edge}>In the beginning</div>}

        <div className={styles.text}>
          <div className={styles.chapters}>
            {!!activePart && (
              <>
                <div>
                  {activePart.chaptersIds?.map(chapterId => {
                    return <div key={chapterId}>{getChapterById(chapterId)?.title}</div>
                  })}
                </div>
                <AddPartButton onClick={() => addNewChapter(story.chaptersIds.length)}>
                  Add chapter
                </AddPartButton>
              </>
            )}
            {!!activeChapter && <ChapterEditor chapter={activeChapter} />}
            {/* <div className={styles.empty}>No chapters yet</div> */}
          </div>
        </div>

        {story?.chaptersIds?.length === 0 ? (
          <StartStory story={story} />
        ) : (
          !activeContent && <StoryPreview story={story} />
        )}

        {!activeContent && <div className={styles.edge}>The End</div>}

        <div className={styles.sidebarShadow} />
      </section>
    </div>
  )
}
