import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProductsProvider } from './context/ProductsContext'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Search from './pages/Search'
import Products from './pages/Products'
import CategoryProducts from './pages/CategoryProducts'
import Wishlist from './pages/Wishlist'

// User Pages
import Profile from './pages/Profile'
import Orders from './pages/Orders'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProduct'
import AdminProductNew from './pages/admin/AdminProductNew'
import AdminProductEdit from './pages/admin/AdminProductEdit'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminClients from './pages/admin/AdminClients'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = localStorage.getItem('user')
  const isAdmin = localStorage.getItem('isAdmin')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <div className="min-h-screen bg-black">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/category/:categoryId" element={<CategoryProducts />} />
                      <Route path="/wishlist" element={<Wishlist />} />

                      {/* Protected User Routes */}
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />


                      {/* Admin Routes */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminProducts />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products/new"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminProductNew />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products/edit/:id"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminProductEdit />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/categories"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminCategories />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/orders"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminOrders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/clients"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminClients />
                          </ProtectedRoute>
                        }
                      />

                      {/* Redirects */}
                      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
