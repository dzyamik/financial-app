'use client'

import Button from './button'
import { Moon, Sun } from 'lucide-react'
import { CookiesProvider } from 'react-cookie'
import useDarkMode from '@/hooks/use-dark-mode'

function DarkModeButton({ defaultMode }) {
    const { theme, toggleTheme } = useDarkMode(defaultMode)

    return (
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' && <Moon className="w-6 h-6" />}
            {theme === 'dark' && <Sun className="w-6 h-6" />}
        </Button>
    )
}

export default function DarkModeToggle({ defaultMode = 'dark' }) {
    return (
        <CookiesProvider>
            <DarkModeButton defaultMode={defaultMode} />
        </CookiesProvider>
    )
}
