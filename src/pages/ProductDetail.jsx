import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, Heart, Star, Truck, Shield, Package, 
  ChevronLeft, ChevronRight, Minus, Plus, AlertCircle, Check
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import { getProductById } from '../api/productApi'
import { getCategoryById } from '../api/categoryApi'
import { useCart } from '../hook/UseCart'
import { useToast } from '../hook/UseToast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { showToast, showError, showSuccess } = useToast()
  
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [currentImage, setCurrentImage] = useState(0)

  // Imágenes de ejemplo (en producción vendrían del backend)
  const images = [
    { id: 1, alt: 'Vista frontal' },
    { id: 2, alt: 'Vista trasera' },
    { id: 3, alt: 'Detalle' },
    { id: 4, alt: 'Modelo' },
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const productData = await getProductById(id)
      setProduct(productData)
      
      if (productData.category_id) {
        const categoryData = await getCategoryById(productData.category_id)
        setCategory(categoryData)
      }
    } catch (error) {
      console.error('Error cargando producto:', error)
      showError('Error al cargar el producto')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showError('Producto agotado')
      return
    }
    
    if (quantity > product.stock) {
      showError(`Solo hay ${product.stock} unidades disponibles`)
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    
    showSuccess(`${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > product.stock) {
      showError(`Solo hay ${product.stock} unidades disponibles`)
      return
    }
    setQuantity(newQuantity)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando producto...</p>
          </div>
        </div>
      </>
    )
  }

  if (!product) {
    return null
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-green-400">
              Inicio
            </button>
            <span className="text-gray-600">/</span>
            <button onClick={() => navigate('/products')} className="text-gray-400 hover:text-green-400">
              Productos
            </button>
            <span className="text-gray-600">/</span>
            {category && (
              <>
                <span className="text-gray-400">{category.name}</span>
                <span className="text-gray-600">/</span>
              </>
            )}
            <span className="text-white">{product.name}</span>
          </nav>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-zinc-950 rounded-2xl border-2 border-green-400/30 overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={120} className="text-green-400/20" />
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 backdrop-blur-sm border border-green-400/30 rounded-full text-green-400 hover:bg-green-400/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 backdrop-blur-sm border border-green-400/30 rounded-full text-green-400 hover:bg-green-400/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-orange-500 text-black text-sm font-bold rounded-lg">
                    ¡ÚLTIMAS {product.stock} UNIDADES!
                  </div>
                )}

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-3xl">AGOTADO</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImage(idx)}
                    className={`aspect-square bg-zinc-950 rounded-lg border-2 transition-all ${
                      currentImage === idx 
                        ? 'border-green-400 shadow-lg shadow-green-400/30' 
                        : 'border-green-400/20 hover:border-green-400/50'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-green-400/30" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              {category && (
                <span className="inline-block px-4 py-1 bg-green-400/10 border border-green-400/30 text-green-400 rounded-full text-sm font-semibold">
                  {category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl font-black text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <span className="text-gray-400">4.5 (128 reseñas)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-green-400">
                  ${product.price}
                </span>
                <span className="text-gray-500 line-through text-xl">
                  ${(product.price * 1.3).toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold">
                  -30% OFF
                </span>
              </div>

              {/* Description */}
              <div className="p-6 bg-zinc-950 rounded-xl border border-green-400/20">
                <p className="text-gray-300 leading-relaxed">
                  Prenda de alta calidad con diseño urbano exclusivo. Fabricada con materiales premium 
                  que garantizan durabilidad y comodidad. Perfecta para cualquier ocasión, combinando 
                  estilo y funcionalidad en un solo producto.
                </p>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-bold">Talla:</label>
                  <button className="text-green-400 text-sm hover:text-green-300">
                    Guía de tallas
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-green-400 text-black border-2 border-green-400'
                          : 'bg-zinc-950 text-gray-400 border-2 border-green-400/20 hover:border-green-400/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-white font-bold mb-3">Cantidad:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-zinc-950 border border-green-400/30 rounded-lg p-1">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center text-green-400 hover:bg-green-400/20 rounded transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 text-center text-white font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-green-400 hover:bg-green-400/20 rounded transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <span className="text-gray-400">
                    Stock disponible: <span className="text-green-400 font-semibold">{product.stock}</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-green-400/50 hover:shadow-green-400/70 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  <span>{product.stock > 0 ? 'AGREGAR AL CARRITO' : 'AGOTADO'}</span>
                </button>
                <button className="px-6 py-4 bg-zinc-950 border-2 border-green-400/30 hover:border-green-400/60 text-green-400 rounded-lg transition-all flex items-center justify-center">
                  <Heart size={20} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-950 rounded-lg border border-green-400/20 text-center">
                  <Truck className="mx-auto text-green-400 mb-2" size={24} />
                  <p className="text-xs text-gray-400">Envío gratis</p>
                  <p className="text-white font-semibold text-sm">+$5000</p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-green-400/20 text-center">
                  <Shield className="mx-auto text-green-400 mb-2" size={24} />
                  <p className="text-xs text-gray-400">Compra</p>
                  <p className="text-white font-semibold text-sm">Segura</p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-lg border border-green-400/20 text-center">
                  <Check className="mx-auto text-green-400 mb-2" size={24} />
                  <p className="text-xs text-gray-400">Devolución</p>
                  <p className="text-white font-semibold text-sm">30 días</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16">
            <div className="border-b border-green-400/30">
              <div className="flex gap-8">
                <button className="pb-4 border-b-2 border-green-400 text-green-400 font-bold">
                  Especificaciones
                </button>
                <button className="pb-4 border-b-2 border-transparent text-gray-400 hover:text-white font-bold">
                  Reseñas (128)
                </button>
                <button className="pb-4 border-b-2 border-transparent text-gray-400 hover:text-white font-bold">
                  Envíos
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-8 bg-zinc-950 rounded-xl border border-green-400/20 p-8">
              <h3 className="text-2xl font-black text-white mb-6">Especificaciones del Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-green-400/10">
                  <span className="text-gray-400">Material:</span>
                  <span className="text-white font-semibold">100% Algodón</span>
                </div>
                <div className="flex justify-between py-3 border-b border-green-400/10">
                  <span className="text-gray-400">Color:</span>
                  <span className="text-white font-semibold">Negro</span>
                </div>
                <div className="flex justify-between py-3 border-b border-green-400/10">
                  <span className="text-gray-400">Peso:</span>
                  <span className="text-white font-semibold">250g</span>
                </div>
                <div className="flex justify-between py-3 border-b border-green-400/10">
                  <span className="text-gray-400">Origen:</span>
                  <span className="text-white font-semibold">Argentina</span>
                </div>
                <div className="flex justify-between py-3 border-b border-green-400/10">
                  <span className="text-gray-400">SKU:</span>
                  <span className="text-white font-semibold">NT-{product.id_key}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-green-400/10">
                  <span className="text-gray-400">Stock ID:</span>
                  <span className="text-white font-semibold">{product.id_key}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ProductDetail