import { FC, useState } from 'react'
import { Editor } from '@tiptap/react'
import { Select } from 'antd'

type historyControlsProps = {
  editor: Editor | null
}

export const TextTypeControls: FC<historyControlsProps> = ({ editor }) => {
  const [currentType, setCurrentType] = useState('paragraph')

  const getOptions = () => {
    const headings = [...Array(6).fill(0)].map((_, i) => {
      const level = (i + 1) as 1 | 2 | 3 | 4 | 5 | 6
      return {
        value: `heading${level}`,
        label: `Heading ${level}`,
        disabled: `heading${level}` === currentType,
      }
    })

    return [
      { value: 'paragraph', label: 'Paragraph', disabled: 'paragraph' === currentType },
      ...headings,
    ]
  }

  const handleChange = (value: string) => {
    setCurrentType(value)
    if (value === 'paragraph') {
      editor?.chain().focus().setParagraph().run()
      return
    }

    const level = parseInt(value.replace('heading', ''), 10) as 1 | 2 | 3 | 4 | 5 | 6

    editor?.chain().focus().toggleHeading({ level }).run()
  }

  if (!editor) return null

  return (
    <>
      <Select
        defaultValue={currentType}
        style={{ width: 120 }}
        onChange={handleChange}
        options={getOptions()}
      />
    </>
  )
}
