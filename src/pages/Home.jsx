import React from 'react'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import Hero from '../components/hero/Hero'
import CategorySection from '../components/categories/CategorySection'
import ProductGrid from '../components/products/ProductGrid'
import CartDrawer from '../components/cart/CartDrawer'

const Home = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <CategorySection />
        <ProductGrid />
      </main>
      <Footer />
    </>
  )
}

export default Home