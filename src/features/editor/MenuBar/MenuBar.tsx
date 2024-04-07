import { FC } from 'react'
import { Editor } from '@tiptap/react'
import { HistoryControls } from '../controls/HistoryControls/HistoryControls'
import { LinkControl } from '../controls/LinkControl/LinkControl'
import { TextAlignControls } from '../controls/TextAlignControls/TextAlignControls'
import { TextStyleControls } from '../controls/TextStyleControls/TextStyleControls'
import { TextTypeControls } from '../controls/TextTypeControls/TextTypeControls'
import styles from './MenuBar.module.scss'

type MenuBarProps = {
  editor: Editor | null
}
export type ActiveKey =
  | 'paragraph'
  | 'heading'
  | 'textAlign'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'code'
  | 'inlineEquation'
  | 'blockEquation'
export type MenuItem = {
  label: string
  key: string
  isActiveKey: ActiveKey
  iconId?: string
}

export const MenuBar: FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null

  return (
    <div className={styles.wrapper}>
      <HistoryControls editor={editor} />

      <TextTypeControls editor={editor} />

      <TextStyleControls editor={editor} />

      <div className={styles.separator} />

      <TextAlignControls editor={editor} />

      <div className={styles.separator} />

      <LinkControl editor={editor} />
    </div>
  )
}
