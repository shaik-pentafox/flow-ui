// src/main.tsx
import { ThemeProvider } from '@/components/config/ThemeProvider.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { apiCall, apiCallProtected, apiCallFileProtected } from '@/api/config.ts'
import { setupAllInterceptors } from '@/api/interceptor.ts'
import { Toaster } from '@/components/ui/sonner.tsx'
// Initialize the API interceptors
setupAllInterceptors(apiCall, apiCallProtected, apiCallFileProtected);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster position='top-center' />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
