import React from 'react'
import Footer from '../components/common/Footer.jsx'
import Hero from '../components/hero/Hero'
import CategorySection from '../components/categories/CategorySection'
import ProductGrid from '../components/products/ProductGrid'
import CartDrawer from '../components/cart/CartDrawer'
import NavBar from '../components/common/Navbar.jsx'

const Home = () => {
  return (
    <>
      <NavBar />
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