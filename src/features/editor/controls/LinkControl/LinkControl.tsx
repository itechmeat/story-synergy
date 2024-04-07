import { FC, useCallback } from 'react'
import { Link } from '@phosphor-icons/react'
import { Editor } from '@tiptap/react'
import { Button } from 'antd'

type LinkControlProps = {
  editor: Editor | null
}

export const LinkControl: FC<LinkControlProps> = ({ editor }) => {
  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return <Button icon={<Link size={24} />} type="text" aria-label="Undo" onClick={setLink} />
}
