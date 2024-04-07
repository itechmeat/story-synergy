/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useMemo, useState } from 'react'
import { EditorEvents, JSONContent } from '@tiptap/core'
import { Button } from 'antd'
import { useLatest } from 'react-use'
import { Language, askGPT } from '../../../api/gpt'
import { TipTapEditor } from '../../editor/TipTapEditor/TipTapEditor'
import { buildEditorValue } from '../../editor/TipTapEditor/utils'
import useChapterStore from '../chapterStore'
import { IChapter } from '../type'
import styles from './ChapterEditor.module.scss'

type ChapterEditorProps = {
  chapter: IChapter
}

export const ChapterEditor: FC<ChapterEditorProps> = ({ chapter }) => {
  const { getAllChapters, updateChapter } = useChapterStore()

  const [isEditable, setIsEditable] = useState(false)
  const [iteration, setIteration] = useState(0)
  const [lang, setLang] = useState<Language>(Language.Russian)
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<JSONContent>(chapter.content || buildEditorValue(''))

  const allChapters = useMemo(() => {
    return getAllChapters()
  }, [getAllChapters])

  const currentChapterNumber = useMemo(() => {
    const index = allChapters.findIndex(item => item.id === chapter.id)
    return index === -1 ? null : index + 1
  }, [allChapters, chapter])

  const allChaptersNotesList = useMemo(() => {
    return allChapters.map(item => `- ${item.notes}`).join('\n')
  }, [allChapters])

  const prompt = useMemo(() => {
    if (!currentChapterNumber) return
    return `
В моей истории есть такие части:
${allChaptersNotesList}
Напиши полный текст для части №${currentChapterNumber}
    `
  }, [allChaptersNotesList, currentChapterNumber])

  const handleUpdateNotes = (text: string) => {
    console.log('🚀 ~ handleUpdateNotes ~ text:', text)
  }

  const fetchChatGPTResponse = useCallback(
    async (inputText: string) => {
      const defineConfig = () => {
        switch (lang) {
          case Language.Russian:
            return `Ты - писатель, который пишет книги в стиле Стивена Кинга. ${prompt}`
          default:
            return `You are a writer in the style of Stephen King. ${prompt}`
        }
      }

      return await askGPT({
        config: defineConfig(),
        prompt: inputText,
        lang: lang,
      })
    },
    [lang, prompt],
  )

  const handleUpdateContent = useLatest((editorContent: EditorEvents['update']) => {
    const cnt = editorContent.editor.getJSON()
    updateChapter(chapter.id, { content: { ...cnt } })
  })

  const handleGenerate = useCallback(async () => {
    if (!chapter.notes) return
    setIsLoading(true)
    const chatGPTResponse = await fetchChatGPTResponse(chapter.notes)

    if (chatGPTResponse) {
      setContent(buildEditorValue(chatGPTResponse))
    }
    setIsLoading(false)
    setIteration(iteration + 1)
    console.log(chatGPTResponse)
    if (chatGPTResponse) {
      updateChapter(chapter.id, { content: buildEditorValue(chatGPTResponse) })
    }
  }, [chapter, fetchChatGPTResponse, iteration, updateChapter])

  return (
    <div className={styles.chapter}>
      <div className={styles.notes}>
        <textarea
          className={styles.text}
          value={chapter.notes}
          disabled
          onChange={e => handleUpdateNotes(e.target.value)}
        />
      </div>

      <footer className={styles.actions}>
        <Button
          type="primary"
          loading={isLoading}
          disabled={!chapter.notes}
          onClick={handleGenerate}
        >
          Generate content
        </Button>
      </footer>

      {!isLoading && (
        <TipTapEditor
          key={chapter.id}
          editable={isEditable}
          content={chapter.content}
          onUpdate={handleUpdateContent}
          placeholder={isEditable ? 'Start typing...' : undefined}
        />
      )}
    </div>
  )
}
