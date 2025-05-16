import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LoadScript } from '@react-google-maps/api'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <App />

  </StrictMode >,
)
