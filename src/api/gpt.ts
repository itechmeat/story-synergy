import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
  dangerouslyAllowBrowser: true,
})

export type Options = {
  config: string
  prompt: string
  lang?: Language
  model?: GPTModel
}

export enum GPTModel {
  Mistral7BInstruct = 'mistralai/Mistral-7B-Instruct-v0.2',
  Mistral8x7BInstruct = 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  MetaLlama270bChatHF = 'meta-llama/Llama-2-70b-chat-hf',
  GoogleGemma7BInstruct = 'google/gemma-7b-it',
}

export const GPTModelList3 = [
  {
    model: GPTModel.Mistral7BInstruct,
    name: 'Mistral 7B Instruct',
  },
  {
    model: GPTModel.Mistral8x7BInstruct,
    name: 'Mistral 8x7B Instruct',
  },
  {
    model: GPTModel.MetaLlama270bChatHF,
    name: 'Meta LLaMA-2 Chat (70B)',
  },
  {
    model: GPTModel.GoogleGemma7BInstruct,
    name: 'Google Gemma Instruct (7B)',
  },
]

export const GPTModelList = new Map([
  [GPTModel.Mistral7BInstruct, 'Mistral 7B Instruct'],
  [GPTModel.Mistral8x7BInstruct, 'Mistral 8x7B Instruct'],
  [GPTModel.MetaLlama270bChatHF, 'Meta LLaMA-2 Chat (70B)'],
  [GPTModel.GoogleGemma7BInstruct, 'Google Gemma Instruct (7B)'],
])

export enum Language {
  English = 'en',
  Russian = 'ru',
}

const getLangConfig = (lang: Language) => {
  switch (lang) {
    case Language.Russian:
      return 'Отвечай на Русском языке.'
    default:
      return 'Answer in English.'
  }
}

export const askGPT = async (options: Options) => {
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `${options.config}\n\n${getLangConfig(options.lang || Language.English)}`,
        },
        {
          role: 'user',
          content: options.prompt,
        },
      ],
      model: options.model || GPTModel.Mistral8x7BInstruct,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error(error)
  }
}
