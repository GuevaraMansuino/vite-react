import React, { createContext, useState, useEffect } from 'react'
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../api/cartApi'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar carrito desde localStorage al iniciar (el backend no tiene endpoint de carrito)
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error('Error parsing stored cart:', error)
        setCart([])
      }
    }
    setIsLoading(false)
  }, [])

  // Sincronizar con localStorage como backup
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isLoading])

  const addToCart = async (product) => {
    try {
      const productData = {
        product_id: product.id_key || product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        stock: product.stock || 0
      }

      const updatedCart = await apiAddToCart(productData)

      // Verificar que updatedCart e items existan
      if (updatedCart && updatedCart.items && Array.isArray(updatedCart.items)) {
        // Transformar respuesta de la API al formato del frontend
        const transformedItems = updatedCart.items.map(item => ({
          id_key: item.product_id,
          id: item.product_id,
          name: item.name,
          price: item.price,
          stock: item.stock,
          quantity: item.quantity
        }))

        setCart(transformedItems)
      } else {
        console.warn('Updated cart data is invalid:', updatedCart)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Fallback: actualizar localmente si la API falla
      const productId = product.id_key || product.id
      setCart((prev) => {
        const existing = prev.find((item) => (item.id_key || item.id) === productId)
        if (existing) {
          return prev.map((item) =>
            (item.id_key || item.id) === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, { ...product, quantity: 1 }]
      })
    }
  }

  const removeFromCart = async (id) => {
    try {
      await apiRemoveFromCart(id)
      setCart((prev) => prev.filter((item) => (item.id_key || item.id) !== id))
    } catch (error) {
      console.error('Error removing from cart:', error)
      // Fallback: actualizar localmente si la API falla
      setCart((prev) => prev.filter((item) => (item.id_key || item.id) !== id))
    }
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(id)
      return
    }

    try {
      await updateCartItem(id, quantity)
      setCart((prev) =>
        prev.map((item) =>
          (item.id_key || item.id) === id ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      // Fallback: actualizar localmente si la API falla
      setCart((prev) =>
        prev.map((item) =>
          (item.id_key || item.id) === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = async () => {
    try {
      await apiClearCart()
      setCart([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      // Fallback: actualizar localmente si la API falla
      setCart([])
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}