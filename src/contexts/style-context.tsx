import { createContext, useContext } from 'react'

interface StyleContextType {
  primaryColor: string
  textButtonColor: string
}

const StyleContext = createContext<StyleContextType>({
  primaryColor: '#0458EE',
  textButtonColor: '#000000',
})

export function StyleProvider({
  primaryColor,
  textButtonColor,
  children,
}: StyleContextType & { children: React.ReactNode }) {
  return (
    <StyleContext.Provider value={{ primaryColor, textButtonColor }}>
      {children}
    </StyleContext.Provider>
  )
}

export function useStyle() {
  return useContext(StyleContext)
}
