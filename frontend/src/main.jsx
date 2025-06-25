import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './pages/auth/AuthContext.jsx'
import { setupAuthInterceptor } from './utils/authMiddleware.jsx'


const AuthInterceptorSetup = () => {
  const { logout } = useAuth();

  useEffect(() => {
    setupAuthInterceptor(logout);
  }, [logout]);

  return null;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* <AuthInterceptorSetup /> */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
