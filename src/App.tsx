// src/App.tsx
import QueryProvider from "@/api/QueryProvider"
import { AppRoutes } from "./components/AppRoutes"
import { useThemeShortcut } from "./hooks/useThemeShortcut"
import { ReactFlowProvider } from "@xyflow/react"

function App() {
  useThemeShortcut()


  return (
    <QueryProvider>
      <ReactFlowProvider>
        <AppRoutes />
      </ReactFlowProvider>
    </QueryProvider>
  )
}

export default App
