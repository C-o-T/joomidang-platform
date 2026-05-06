import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//index.html의 <div id="root"> 에 React 앱을 연결하는 시작점
createRoot(document.getElementById('root')).render(
  //StrictMode: 개발 중에 잠재적인 문제를 감지해서 경고해주는 도구
  <StrictMode>
    <App />
  </StrictMode>,
)
