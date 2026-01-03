import React, { createContext, useState, useEffect } from 'react'
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist, clearWishlist as apiClearWishlist, checkInWishlist } from '../api/wishlistApi'

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar wishlist desde localStorage al iniciar (el backend no tiene endpoint de wishlist)
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist')
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (error) {
        console.error('Error parsing stored wishlist:', error)
        setWishlist([])
      }
    }
    setIsLoading(false)
  }, [])

  // Sincronizar con localStorage como backup
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, isLoading])

  const addToWishlist = async (product) => {
    try {
      // Verificar si ya está en la wishlist
      const isInWishlist = wishlist.some(item => (item.id_key || item.id) === (product.id_key || product.id))
      if (isInWishlist) {
        return // Ya está en la wishlist, no hacer nada
      }

      const productData = {
        product_id: product.id_key || product.id,
        name: product.name,
        price: product.price,
        stock: product.stock || 0,
        image_url: product.image_url,
        category: product.category
      }

      const updatedWishlist = await apiAddToWishlist(productData)

      // Verificar que updatedWishlist e items existan
      if (updatedWishlist && updatedWishlist.items && Array.isArray(updatedWishlist.items)) {
        // Transformar respuesta de la API al formato del frontend
        const transformedItems = updatedWishlist.items.map(item => ({
          id_key: item.product_id,
          id: item.product_id,
          name: item.name,
          price: item.price,
          stock: item.stock,
          image_url: item.image_url,
          category: item.category
        }))

        setWishlist(transformedItems)
      } else {
        console.warn('Updated wishlist data is invalid:', updatedWishlist)
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      // Fallback: actualizar localmente si la API falla
      const productId = product.id_key || product.id
      const isAlreadyInWishlist = wishlist.some(item => (item.id_key || item.id) === productId)
      if (!isAlreadyInWishlist) {
        setWishlist(prev => [...prev, { ...product }])
      }
    }
  }

  const removeFromWishlist = async (id) => {
    try {
      await apiRemoveFromWishlist(id)
      setWishlist(prev => prev.filter(item => (item.id_key || item.id) !== id))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      // Fallback: actualizar localmente si la API falla
      setWishlist(prev => prev.filter(item => (item.id_key || item.id) !== id))
    }
  }

  const clearWishlist = async () => {
    try {
      await apiClearWishlist()
      setWishlist([])
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      // Fallback: actualizar localmente si la API falla
      setWishlist([])
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.id_key || item.id) === productId)
  }

  const itemCount = wishlist.length

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
