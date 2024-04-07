/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { JSONContent } from '@tiptap/core'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, EditorOptions, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import cn from 'classnames'
import { useClickAway } from 'react-use'
import { MenuBar } from '../MenuBar/MenuBar'
import styles from './TipTapEditor.module.scss'
import { isContentEmptyCheck } from './utils'

export type OnChangeCallback = (files: File[]) => void

export type TipTapContent = JSONContent | null

type Props = {
  content?: TipTapContent
  placeholder?: string
  editable?: boolean
  limit?: number
  onUpdate?: { current: EditorOptions['onUpdate'] }
  onFocus?: () => void
  onBlur?: () => void
}

export const TipTapEditor: FC<Props> = ({
  content,
  editable,
  placeholder,
  limit,
  onUpdate,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const handleFocus = useCallback(() => {
    if (!editable) return
    if (onFocus) onFocus()
    setIsFocused(true)
  }, [editable, onFocus])

  useClickAway(editorRef, () => {
    setIsFocused(false)
    if (onBlur) onBlur()
  })

  const editor = useEditor(
    {
      editable,
      extensions: [
        StarterKit.configure({ codeBlock: false }),
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'FormulaExtension', 'Image'],
        }),
        Link,
        CharacterCount.configure({
          limit,
        }),
      ],
      editorProps: {
        attributes: {
          class: styles.editorWrapper,
        },
      },
      content,
      ...(onUpdate && { onUpdate: onUpdate.current }),
      ...(onBlur && { onBlur }),
      onFocus: () => handleFocus(),
    },
    [onUpdate],
  )

  const isContentEmpty = useMemo((): boolean => {
    return isContentEmptyCheck(content)
  }, [content])

  const isPlaceholderVisible = useMemo((): boolean => {
    return !content || (isContentEmpty && !isFocused)
  }, [content, isContentEmpty, isFocused])

  return (
    <div
      ref={editorRef}
      className={cn(editable ? styles.editor : styles.viewer, {
        [styles.focused]: isFocused,
        contentEditor: editable,
      })}
    >
      {editable && (
        <div className={cn(styles.panel, { [styles.panelVisible]: isFocused })}>
          <MenuBar editor={editor} />
        </div>
      )}
      {(!isPlaceholderVisible || editable) && <EditorContent editor={editor} />}
      {isPlaceholderVisible && <div className={styles.placeholder}>{placeholder}</div>}
    </div>
  )
}
