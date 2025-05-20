import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TheorySection from "./components/TheorySection";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TheorySection />
    <App />
  </StrictMode>,
)
