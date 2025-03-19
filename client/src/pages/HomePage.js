import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from '../components/products/ProductGrid';
import { Link } from 'react-router-dom';

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
    <div>
      {/* Hero Section */}
      <div className="bg-amber-800 text-white py-16 px-4 rounded-lg mb-12 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Experience Premium Coffee
          </h1>
          <p className="text-xl mb-8 max-w-lg">
            Artisanal coffee sourced from the finest farms around the world,
            roasted to perfection.
          </p>
          <Link
            to="/products"
            className="bg-white text-amber-800 px-8 py-3 rounded-lg font-medium hover:bg-amber-100 transition"
          >
            Shop Now
          </Link>
        </div>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Background image would be applied via CSS with a background image */}
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-amber-700 hover:text-amber-900">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </div>

      {/* About Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2010, Coffee Shop has been serving premium coffee to
            coffee lovers across the country. We believe in sustainably sourced
            beans, expertly roasted to bring out the unique flavors of each
            origin.
          </p>
          <p className="text-gray-700 mb-4">
            Our baristas are trained to craft the perfect cup, ensuring a
            consistent and exceptional coffee experience every time.
          </p>
          <Link to="/about" className="text-amber-700 hover:underline">
            Learn more about us
          </Link>
        </div>
        <div className="bg-gray-200 rounded-lg h-64">
          {/* Placeholder for an image */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Coffee Shop Image
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage