/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type StoryState = {
  isMenuOpened: boolean
  setIsMenuOpened: (isOpened: boolean) => void
}

export const useLayoutStore = create<StoryState>()(
  devtools((set, get) => ({
    isMenuOpened: false,
    setIsMenuOpened: isOpened => {
      set({ isMenuOpened: isOpened })
    },
  })),
)
