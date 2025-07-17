import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './Context/authcontext.jsx'
import ChatContextProvider from './Context/chatcontext.jsx'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<AuthContextProvider>

<ChatContextProvider>
    <App />
</ChatContextProvider>
</AuthContextProvider>
</BrowserRouter>

)
