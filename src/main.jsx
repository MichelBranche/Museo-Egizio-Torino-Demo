import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant/400.css'
import '@fontsource/cormorant/400-italic.css'
import '@fontsource/cormorant/700.css'
import '@fontsource/cormorant/700-italic.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/400-italic.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/500-italic.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/700-italic.css'
import '@fontsource/noto-sans-egyptian-hieroglyphs/400.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
