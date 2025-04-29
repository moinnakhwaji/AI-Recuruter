'use client '

import { createContext,useContext,useState } from "react"

interface SidebarContextType {
    isSidebarOpen: boolean
    toggleSidebar: () => void
    setSidebarOpen: (value: boolean) => void
  }
  
  const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

  export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) throw new Error('useSidebar must be used within SidebarProvider')
    return context
  }

  export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true)
  
    const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  
    return (
      <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}>
        {children}
      </SidebarContext.Provider>
    )
  }