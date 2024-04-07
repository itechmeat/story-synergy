/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback } from 'react'
import { Tree, TreeProps } from 'antd'
import { DataNode } from 'antd/es/tree'
import { NavLink } from 'react-router-dom'
import { UUID } from '../../../types/common'
import useChapterStore from '../../chapter/chapterStore'
import usePartStore from '../../part/partStore'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StoryMenu.module.scss'

type Props = {
  story: IStory
  expandedKeys?: UUID[]
  onAddChapter: (index: number, partId: string) => void
}

export const StoryMenu: FC<Props> = ({ story, expandedKeys, onAddChapter }) => {
  const { updateStory } = useStoryStore()
  const { getPartById, getPartByChapterId, updatePart } = usePartStore()
  const { getChapterById } = useChapterStore()

  const buildMenu = useCallback(() => {
    if (!story) return
    return story.partsIds?.map(partId => {
      const part = getPartById(partId)
      if (!part) return
      return {
        key: partId,
        title: part.title,
        children:
          part.chaptersIds?.map(chaptersId => {
            const chapter = getChapterById(chaptersId)
            return { key: chaptersId, title: chapter?.title }
          }) || [],
      }
    }) as DataNode[]
  }, [getChapterById, getPartById, story])

  const onDragEnter: TreeProps['onDragEnter'] = () => {
    // console.log('onDragEnter', info)
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  }

  const onDrop2: TreeProps['onDrop'] = event => {
    const dropKey = event.node.key as UUID
    const dragKey = event.dragNode.key as UUID
    const dragPos = event.dragNode.pos.split('-')
    const dropPos = event.node.pos.split('-')
    const dropPosition = event.dropPosition - Number(dropPos[dropPos.length - 1])
    if (!dropKey || !event.dropToGap || dragPos.length !== dropPos.length) return
    const activePart = getPartById(dropKey)
    const activeChapter = getChapterById(dropKey)

    if (activePart) {
      const partsIds = [...(story.partsIds || [])]
      const dragIndex = partsIds.indexOf(dragKey)
      const dropIndex = partsIds.indexOf(dropKey)
      const lastIndex = dropPosition === -1 ? 0 : dragIndex > dropIndex ? dropIndex + 1 : dropIndex
      partsIds.splice(dragIndex, 1)
      partsIds.splice(lastIndex, 0, dragKey)

      updateStory(story.id, {
        ...story,
        partsIds,
      })
    }

    if (activeChapter) {
      const oldPart = getPartByChapterId(dragKey)
      if (!oldPart) return
      const chaptersIds = [...(oldPart?.chaptersIds || [])]
      const dragIndex = chaptersIds.indexOf(dragKey)
      const dropIndex = chaptersIds.indexOf(dropKey)
      const lastIndex = dropPosition === -1 ? 0 : dragIndex > dropIndex ? dropIndex + 1 : dropIndex
      chaptersIds.splice(dragIndex, 1)
      chaptersIds.splice(lastIndex, 0, dragKey)

      updatePart(oldPart.id, {
        ...oldPart,
        chaptersIds,
      })
    }
  }

  return (
    <nav className={styles.menu}>
      <Tree
        className={styles.tree}
        defaultExpandedKeys={expandedKeys}
        draggable
        blockNode
        treeData={buildMenu()}
        checkStrictly={true}
        titleRender={nodeData => (
          <span className={styles.item}>
            <NavLink to={`/stories/${story.id}/${nodeData.key}`}>{`${nodeData.title}`}</NavLink>
            {nodeData.children && (
              <button
                className={styles.add}
                onClick={() =>
                  onAddChapter(nodeData?.children?.length || 0, nodeData.key as string)
                }
              >
                +
              </button>
            )}
          </span>
        )}
        onDragEnter={onDragEnter}
        onDrop={onDrop2}
        selectable={false}
      />
    </nav>
  )
}
