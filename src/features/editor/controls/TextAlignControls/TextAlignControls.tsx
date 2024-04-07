import { FC } from 'react'
import {
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
} from '@phosphor-icons/react'
import { Editor } from '@tiptap/react'
import { Button } from 'antd'

type historyControlsProps = {
  editor: Editor | null
}

export const TextAlignControls: FC<historyControlsProps> = ({ editor }) => {
  if (!editor) return null

  return (
    <>
      <Button
        icon={<TextAlignLeft size={24} />}
        disabled={editor.isActive({ textAlign: 'left' })}
        type="text"
        aria-label="Left Align"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />

      <Button
        icon={<TextAlignCenter size={24} />}
        disabled={editor.isActive({ textAlign: 'center' })}
        type="text"
        aria-label="Center Align"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />

      <Button
        icon={<TextAlignRight size={24} />}
        disabled={editor.isActive({ textAlign: 'right' })}
        type="text"
        aria-label="Right Align"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />

      <Button
        icon={<TextAlignJustify size={24} />}
        disabled={editor.isActive({ textAlign: 'justify' })}
        type="text"
        aria-label="Justify Align"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      />
    </>
  )
}
