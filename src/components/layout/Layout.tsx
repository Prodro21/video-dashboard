import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
}
