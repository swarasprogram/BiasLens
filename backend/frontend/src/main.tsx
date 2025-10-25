import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AnalysePage from './pages/analyse.tsx'
import Home from './pages/Home.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyse" element={<AnalysePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
