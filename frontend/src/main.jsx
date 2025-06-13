import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'

import { GoogleOAuthProvider ,GoogleLogin } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId="716619737347-c9ji0i12n0sl900ro113jmohj01ohfb5.apps.googleusercontent.com">
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter >
  </GoogleOAuthProvider>

)


