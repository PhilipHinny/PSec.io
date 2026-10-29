import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './style.css'

const queryClient = new QueryClient()
const root = document.getElementById('root')
if (!root) throw new Error('Root element missing')

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <main>
        <h1>PSec AI</h1>
        <p>Foundation workspace. Sign-in and reporting arrive in later prompts.</p>
      </main>
    </QueryClientProvider>
  </StrictMode>,
)
