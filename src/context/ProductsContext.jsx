import React, { createContext, useState, useEffect, useContext } from 'react'
import { getProducts } from '../api/productApi'

export const ProductsContext = createContext({
  products: [],
  loading: false,
  error: null,
  refreshProducts: () => {},
  loadProducts: () => {}
})

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadProducts = async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const data = await getProducts(0, 1000) // Load all products for now

      // Ensure no duplicates by using a Map to track unique products
      const productMap = new Map()

      data.forEach(product => {
        const productId = product.id_key || product.id
        productMap.set(productId, product)
      })

      setProducts(Array.from(productMap.values()))
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Error al cargar los productos')
      // Don't throw error, just log it
    } finally {
      setLoading(false)
    }
  }

  const refreshProducts = () => {
    loadProducts(true)
  }

  // Only load products if we're not in admin routes
  useEffect(() => {
    // Check if we're in admin routes
    const isAdminRoute = window.location.pathname.startsWith('/admin')

    if (!isAdminRoute) {
      loadProducts()
    }
  }, [])

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
        loadProducts
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  return context
}
