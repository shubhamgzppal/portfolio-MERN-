import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'
import './styles/tailwind.css'  // Import Tailwind first
import './styles/main.scss'  // Then import SCSS
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimatePresence mode="wait">
      <App />
    </AnimatePresence>
  </StrictMode>,
)