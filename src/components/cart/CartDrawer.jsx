import React from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { useCart } from '../../hook/UseCart'
import { useToast } from '../../hook/UseToast'
import { createOrder } from '../../api/orderApi'
import { createBill } from '../../api/billApi'
import { updateProduct } from '../../api/productApi'
import apiClient from '../../api/axios.config'
import CartItem from './CartItem'

const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, total, clearCart } = useCart()
  const { showToast } = useToast()

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Tu carrito está vacío', 'error')
      return
    }

    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      showToast('Debes iniciar sesión para realizar una compra', 'error')
      return
    }

    try {
      showToast('Procesando compra...', 'info')

      // 1️⃣ CREAR BILL (PRIMERO)
      const billData = {
        bill_number: `BILL-${Date.now()}`,
        discount: 0,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        total: total,
        payment_type: 1, // CASH
        client_id: user.id
      }

      console.log('Creating bill:', billData)
      const billResponse = await createBill(billData)
      const bill = billResponse.data ?? billResponse
      console.log('Bill created:', bill)

      // 2️⃣ CREAR ORDER CON bill_id
      const orderData = {
        client_id: user.id,
        total: total,
        status: 1, // PENDING
        delivery_method: 2, // ON_HAND
        date: new Date().toISOString(),
        bill_id: bill.id
      }

      console.log('Creating order:', orderData)
      const orderResponse = await createOrder(orderData)
      const order = orderResponse.data ?? orderResponse
      console.log('Order created:', order)

      // 3️⃣ CREAR ORDER DETAILS
      const orderDetailsPromises = cart.map(item =>
        apiClient.post('/order_details', {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })
      )

      await Promise.all(orderDetailsPromises)
      console.log('Order details created')

      // 4️⃣ ACTUALIZAR STOCK
      const stockUpdates = cart.map(item =>
        updateProduct(item.id, {
          id: item.id, // 👈 ID DUPLICADO (path + body)
          name: item.name,
          price: item.price,
          category_id: item.category_id,
          stock: item.stock - item.quantity
        })
      )   
      await Promise.all(stockUpdates)
      console.log('Stock updated')

      // 5️⃣ LIMPIAR Y CERRAR
      clearCart()
      setIsOpen(false)
      showToast('¡Compra realizada con éxito!', 'success')

    } catch (error) {
      console.error('Error al procesar la compra:', error)
      console.error('Error details:', error.response?.data)

      showToast(
        `Error al procesar la compra: ${
          error.response?.data?.message || error.message
        }`,
        'error'
      )
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-black z-50 shadow-2xl shadow-green-400/20 border-l border-green-400/30 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-6 border-b border-green-400/30 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-400">Tu Carrito</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm mt-2">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            cart.map(item => (
              <CartItem key={item.id_key} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-green-400/30 space-y-4 bg-zinc-950">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Envío:</span>
                <span className="text-green-400">GRATIS</span>
              </div>
              <div className="h-px bg-green-400/20 my-3"></div>
              <div className="flex items-center justify-between text-xl font-bold">
                <span className="text-gray-300">Total:</span>
                <span className="text-green-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 text-lg"
            >
              FINALIZAR COMPRA
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-gray-300 font-semibold rounded-lg transition-colors border border-green-400/20"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
