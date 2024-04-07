/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useMemo, useState } from 'react'
import { Button, InputNumber, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { GPTModel, GPTModelList, Language, askGPT } from '../../../api/gpt'
import { UUID } from '../../../types/common'
import useChapterStore from '../../chapter/chapterStore'
import { buildEmptyChapter } from '../../chapter/constants'
import { buildEditorValue } from '../../editor/TipTapEditor/utils'
import { buildEmptyPart } from '../../part/constants'
import usePartStore from '../../part/partStore'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StartStory.module.scss'

type Props = {
  story: IStory
}

export const StartStory: FC<Props> = ({ story }) => {
  const navigate = useNavigate()

  const { updateStory } = useStoryStore()
  const { createPart } = usePartStore()
  const { createChapter } = useChapterStore()

  const [text, setText] = useState<string>()
  const [lang, setLang] = useState<Language>(Language.Russian)
  const [model, setModel] = useState<GPTModel>(GPTModel.Mistral8x7BInstruct)
  const [minChapters, setMinChapters] = useState<number>(5)
  const [maxChapters, setMaxChapters] = useState<number>(10)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>()

  const formattedResponse = useMemo(() => {
    if (!response) return
    return response
      .split('<c>')
      .slice(1)
      .map(chapter => {
        let title, description
        const titleMatch = chapter.match(/<t>(.*?)<\/t>/)
        const descriptionMatch = chapter.match(/<d>(.*?)<\/d>/)

        if (titleMatch && descriptionMatch) {
          title = titleMatch[1]
          description = descriptionMatch[1]
        } else {
          // Handling the case when the structure is <c></c><d></d>
          title = 'Untitled Chapter' // Default title if not found
          description = chapter.split('</c><d>')[1]?.split('</d>')[0] || 'No description provided' // Attempt to extract description
        }

        return { title, description }
      })
  }, [response])

  const handleChangeLang = (value: Language) => {
    setLang(value)
  }

  const handleChangeModel = (value: GPTModel) => {
    setModel(value)
  }

  const handleMinChapters = (e: number | null) => {
    setMinChapters(e || 1)
  }

  const handleMaxChapters = (e: number | null) => {
    setMaxChapters(e || 20)
  }

  const fetchChatGPTResponse = useCallback(
    async (inputText: string) => {
      const defineTask = () => {
        const range = minChapters === maxChapters ? minChapters : minChapters + '-' + maxChapters
        switch (lang) {
          case Language.Russian:
            return `Твоя задача - по описанию автора составить список из ${range} эпизодов, которые будут описывать историю`
          default:
            return `Your task is to create a list of ${range} episodes based on the author's description that will narrate the story`
        }
      }

      const defineConfig = () => {
        switch (lang) {
          case Language.Russian:
            return `
            Ты - писатель, который пишет книги в стиле Стивена Кинга. ${defineTask()}.
            В ответе пришли только список эпизодов и ничего более. Фотмат ответа - ненумерованый список, в каждом пункте название эпизода и описание эпизода.
            Каждый эпизод заключен в тег <c>, название в теге <t> (только название, без префикса "эпизод" и подобного), описание в теге <d>.
            Т.е. структура конечного формата: <c><t>название</t><d>описание</d></c>.
            Пришли полный список без сокращений и пропусков.
            `
          default:
            return `
            You are a writer in the style of Stephen King. ${defineTask()}.
            In your response, provide only the list of episodes and nothing more. The response format should be an unordered list, with each item containing the episode title and description.
            Each episode is enclosed in a <c> tag, the title in a <t> tag (title only, without any prefix like "episode" or similar), and the description in a <d> tag.
            Thus, the final format structure is: <c><t>title</t><d>description</d></c>.
            Send the complete list without abbreviations or omissions.
            `
        }
      }

      return await askGPT({
        config: defineConfig(),
        prompt: inputText,
        lang: lang,
        model: model,
      })
    },
    [lang, maxChapters, minChapters, model],
  )

  const handleSubmit = useCallback(async () => {
    if (!text) return
    setIsLoading(true)
    const chatGPTResponse = await fetchChatGPTResponse(text)
    if (chatGPTResponse) {
      setResponse(chatGPTResponse)
    }
    setIsLoading(false)
    console.log(chatGPTResponse)
  }, [fetchChatGPTResponse, text])

  const handleSave = useCallback(() => {
    if (!formattedResponse?.length) return
    const part = buildEmptyPart(1, story.id)
    if (!part) return

    const chaptersIds: UUID[] = []

    formattedResponse.forEach(async item => {
      const chapter = buildEmptyChapter(1, part.id, story.id)
      if (item.title) {
        chapter.title = item.title
      }
      if (item.description) {
        chapter.notes = item.description
        chapter.content = buildEditorValue('')
      }
      chaptersIds.push(chapter.id)
      await createChapter(chapter)
    })

    createPart({
      ...part,
      chaptersIds,
    })

    updateStory(story.id, {
      ...story,
      partsIds: [part.id],
      chaptersIds,
    })
    setResponse(null)
    navigate(`/stories/${story.id}/${part.id}`)
  }, [createChapter, createPart, formattedResponse, navigate, story, updateStory])

  if (response) {
    return (
      <div className={styles.result}>
        <ul className={styles.list}>
          {formattedResponse?.map((chpater, index) => (
            <li key={index} className={styles.chapter}>
              <h3 className={styles.title}>{chpater.title}</h3>
              <p className={styles.paragraph}>{chpater.description}</p>
            </li>
          ))}
        </ul>
        <footer className={styles.actions}>
          <Button type="default" onClick={() => setResponse(null)}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Approve and Save
          </Button>
        </footer>
      </div>
    )
  }

  return (
    <div className={styles.start}>
      <div className={styles.row}>
        Language of the story:{' '}
        <Select
          defaultValue={Language.Russian}
          style={{ width: 120 }}
          options={[
            { value: Language.Russian, label: 'Русский' },
            { value: Language.English, label: 'English' },
          ]}
          disabled={isLoading}
          onChange={handleChangeLang}
        />
      </div>

      <div className={styles.row}>
        LLM:{' '}
        <Select
          defaultValue={GPTModel.Mistral8x7BInstruct}
          style={{ width: 300 }}
          options={Array.from(GPTModelList, ([value, label]) => ({ value, label }))}
          disabled={isLoading}
          onChange={handleChangeModel}
        />
      </div>

      <div className={styles.row}>
        Number of chapters from{' '}
        <InputNumber
          min={1}
          max={maxChapters}
          defaultValue={minChapters}
          disabled={isLoading}
          onChange={handleMinChapters}
        />{' '}
        to{' '}
        <InputNumber
          min={minChapters}
          max={50}
          defaultValue={maxChapters}
          disabled={isLoading}
          onChange={handleMaxChapters}
        />
      </div>

      <div className={styles.row}>
        <p>Describe your story (in Russian):</p>
        <p>
          <textarea
            className={styles.text}
            value={text}
            disabled={isLoading}
            onChange={e => setText(e.target.value)}
          />
        </p>
      </div>

      <div className={styles.row}>
        <Button type="primary" loading={isLoading} disabled={!text} onClick={handleSubmit}>
          Generate chapters
        </Button>
      </div>
    </div>
  )
}
