import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import Home from './pages/Home'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <div className="min-h-screen bg-black">
            <Home />
          </div>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App