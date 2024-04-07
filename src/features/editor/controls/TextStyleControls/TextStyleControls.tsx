import { FC } from 'react'
import { TextB, TextItalic, TextStrikethrough, TextUnderline } from '@phosphor-icons/react'
import { Editor } from '@tiptap/react'
import { Button } from 'antd'

type historyControlsProps = {
  editor: Editor | null
}

export const TextStyleControls: FC<historyControlsProps> = ({ editor }) => {
  if (!editor) return null

  return (
    <>
      <Button
        icon={<TextB size={24} />}
        type={editor.isActive('bold') ? 'primary' : 'text'}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        aria-label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <Button
        icon={<TextItalic size={24} />}
        type={editor.isActive('italic') ? 'primary' : 'text'}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        aria-label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <Button
        icon={<TextUnderline size={24} />}
        type={editor.isActive('underline') ? 'primary' : 'text'}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        aria-label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

      <Button
        icon={<TextStrikethrough size={24} />}
        type={editor.isActive('strike') ? 'primary' : 'text'}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        aria-label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
    </>
  )
}
