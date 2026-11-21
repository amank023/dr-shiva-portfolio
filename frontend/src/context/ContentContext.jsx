import { createContext, useContext, useState, useEffect } from 'react'
import { getContent } from '../hooks/api'

const ContentContext = createContext()

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshContent = async () => {
    try {
      const { data } = await getContent()
      if (data && typeof data === 'object') {
        setContent(data)
      }
    } catch {
      // Keep existing or fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshContent()
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent, setContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export const usePortfolioContent = () => useContext(ContentContext)
