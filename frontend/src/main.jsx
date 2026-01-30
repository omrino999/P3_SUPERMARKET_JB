import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode removed - it causes double API calls in development
createRoot(document.getElementById('root')).render(<App />)
