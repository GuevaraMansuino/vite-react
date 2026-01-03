import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider')
  }

  const { cart, setCart, isOpen, setIsOpen, itemCount } = context

  const addToCart = (product) => {
    const productId = product.id_key || product.id

    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => (item.id_key || item.id) === productId
      )

      // 🟢 si ya existe, sumar cantidad
      if (existingItem) {
        return prevCart.map(item =>
          (item.id_key || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // 🟢 si no existe, agregar nuevo
      return [
        ...prevCart,
        {
          ...product,
          quantity: 1
        }
      ]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart =>
      prevCart.filter(
        item => (item.id_key || item.id) !== productId
      )
    )
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        (item.id_key || item.id) === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return {
    cart,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount
  }
}
