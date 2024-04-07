import { FC, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StoriesPage } from './pages/StoriesPage'
import { StoryCreate } from './pages/StoryCreatePage'
import { StoryPage } from './pages/StoryPage'

export const Router: FC = () => {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="stories">
          <Route index element={<StoriesPage />} />
          <Route path="create" element={<StoryCreate />} />
          <Route path=":storyId" element={<StoryPage />} />

          <Route path=":storyId">
            <Route index element={<StoryPage />} />
            <Route path=":contentId" element={<StoryPage />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
