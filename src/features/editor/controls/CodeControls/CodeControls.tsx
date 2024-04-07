import { FC, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { MenuDropdown, MenuDropdownItem } from '../../MenuDropdown/MenuDropdown'
import { ActiveKey } from '../../MenuBar/MenuBar'

type historyControlsProps = {
  editor: Editor | null
  onBuildMenu: (
    name: string,
    key: string,
    isActiveKey: ActiveKey,
  ) => Omit<MenuDropdownItem, 'onSelect'>
}

export const CodeControls: FC<historyControlsProps> = ({ editor, onBuildMenu }) => {
  const codeItems: MenuDropdownItem[] = [
    onBuildMenu('Inline code', 'code', 'code'),
    onBuildMenu('Code block', 'codeBlock', 'codeBlock'),
  ]

  const setCode = useCallback(
    (key: string) => {
      if (key === 'code') {
        editor?.chain().focus().toggleCode().run()
      }
      if (key === 'codeBlock') {
        editor?.chain().focus().toggleCodeBlock().run()
      }
    },
    [editor],
  )

  if (!editor) return null

  return <MenuDropdown items={codeItems} iconId="ProgramBoldStroke" onSelect={setCode} />
}
