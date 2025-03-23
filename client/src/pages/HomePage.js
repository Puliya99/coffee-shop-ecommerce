import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductGrid from '../components/products/ProductGrid'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products')
        setFeaturedProducts(res.data.slice(0, 8))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products. Please try again later.')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="hero"
        style={{ backgroundImage: "url('/images/coffee-hero.jpg')" }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="hero-heading">Experience Premium Coffee</h1>
            <p className="hero-text">
              Artisanal coffee sourced from the finest farms around the world,
              roasted to perfection.
            </p>
            <Link to="/products" className="hero-button">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-amber-600 hover:text-amber-700">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="relative">
                  <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg'
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <Link
                    to={`/products/${product._id}`}
                    className="btn mt-2 w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2010, Coffee Shop has been serving premium coffee to
                coffee lovers across the country. We believe in sustainably
                sourced beans, expertly roasted to bring out the unique flavors
                of each origin.
              </p>
              <p className="text-gray-600 mb-6">
                Our baristas are trained to craft the perfect cup, ensuring a
                consistent and exceptional coffee experience every time.
              </p>
              <Link to="/about" className="btn">
                Learn more about us
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/about-coffee.jpg"
                alt="Coffee Shop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage