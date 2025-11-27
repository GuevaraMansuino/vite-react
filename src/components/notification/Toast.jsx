import React from 'react'
import { X, CheckCircle, XCircle, Info } from 'lucide-react'

const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'error':
        return <XCircle size={20} className="text-red-400" />
      default:
        return <Info size={20} className="text-blue-400" />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-black/90 border-green-400 text-green-100'
      case 'error':
        return 'bg-black/90 border-red-400 text-red-100'
      default:
        return 'bg-black/90 border-green-400 text-green-100'
    }
  }

  return (
    <div
      className={`px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border animate-slideIn ${getStyles()}`}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="font-medium flex-1">{toast.message}</div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast