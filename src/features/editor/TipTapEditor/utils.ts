import { JSONContent } from '@tiptap/core'
import { TipTapContent } from './TipTapEditor'

export function buildEditorValue(value: string) {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: value,
          },
        ],
      },
    ],
  }
}

// TODO: Fix "any" type
export const extractContent = (content: string) => {
  let result = null
  if (content || content === '') {
    if (typeof content !== 'string') {
      return content
    }
    if (!isNaN(Number(content))) {
      return buildEditorValue(content)
    }
    try {
      result = JSON.parse(content)
    } catch (e) {
      result = buildEditorValue(content)
    }
  }
  return result
}

export const isContentEmptyCheck = (content?: TipTapContent | string): boolean => {
  if (!content) return true

  const contentObject = typeof content === 'string' ? extractContent(content) : content

  const cnt = contentObject?.content

  if (cnt?.length === 1 && cnt?.[0].content?.[0].text?.length === 0) return true

  if (
    cnt?.every(
      (item: JSONContent) =>
        item.type && ['heading', 'paragraph'].includes(item.type) && !item.content,
    )
  ) {
    return true
  }

  return !cnt?.length
}
