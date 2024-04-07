import { FC } from 'react'
import { ArrowUUpLeft, ArrowUUpRight } from '@phosphor-icons/react'
import { Editor } from '@tiptap/react'
import { Button } from 'antd'

type historyControlsProps = {
  editor: Editor | null
}

export const HistoryControls: FC<historyControlsProps> = ({ editor }) => {
  if (!editor) return null

  return (
    <>
      <Button
        icon={<ArrowUUpLeft size={24} />}
        disabled={!editor.can().undo()}
        type="text"
        aria-label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      />

      <Button
        icon={<ArrowUUpRight size={24} />}
        disabled={!editor.can().redo()}
        type="text"
        aria-label="Undo"
        onClick={() => editor.chain().focus().redo().run()}
      />
    </>
  )
}
