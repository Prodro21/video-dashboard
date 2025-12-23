import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { wsService } from '@/api'
import { Layout, Header } from '@/components'
import { DashboardPage, SessionsPage, SessionDetailPage, ClipsPage, ClipDetailPage, ChannelsPage, TagsPage } from '@/pages'
import { ToastContainer } from '@/components'

function NotFoundPage() {
  return (
    <>
      <Header title="404 - Not Found" />
      <div className="p-6">
        <p className="text-gray-400">The page you're looking for doesn't exist.</p>
      </div>
    </>
  )
}

export default function App() {
  useEffect(() => {
    wsService.connect()
    return () => {
      wsService.disconnect()
    }
  }, [])

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:id" element={<SessionDetailPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/clips" element={<ClipsPage />} />
          <Route path="/clips/:id" element={<ClipDetailPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </>
  )
}
