"use client"

import { useTheme } from '@/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { MoonStar, Sun } from 'lucide-react'

export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-all duration-300"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 360 : 0,
        }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {theme === 'dark' ? <MoonStar className="w-5 h-5" /> : <Sun className="w-5 h-5" />} 
      </motion.div>
    </motion.button>
  )
}
