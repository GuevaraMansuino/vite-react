import React, { createContext, useState } from 'react'
import ToastContainer from '../components/notification/ToastContainer'

export const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => {
      // Check if a similar toast already exists
      const existingToast = prev.find(toast => toast.message === message && toast.type === type)
      if (existingToast) {
        // If exists, don't add duplicate, but reset its timer
        setTimeout(() => removeToast(existingToast.id), 3000)
        return prev
      }
      // Add new toast
      return [...prev, { id, message, type }]
    })
    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccess = (message) => showToast(message, 'success')
  const showError = (message) => showToast(message, 'error')
  const showInfo = (message) => showToast(message, 'info')

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}