import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/CartContext'

const ProductPage = () => {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`)
        setProduct(res.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product. Please try again later.')
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    )
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
  }

  if (!product) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
        Product not found
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.image || '/placeholder-coffee.jpg'}
          alt={product.name}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold text-amber-700 mb-4">
          ${product.price.toFixed(2)}
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700">{product.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Category</h3>
          <p className="text-gray-700">{product.category}</p>
        </div>

        <div className="mb-6">
          <label htmlFor="quantity" className="block text-lg font-medium mb-2">
            Quantity
          </label>
          <div className="flex items-center">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="px-3 py-1 border rounded-l"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="py-1 px-2 w-16 text-center border-t border-b"
            />
            <button
              onClick={() =>
                quantity < product.stock && setQuantity(quantity + 1)
              }
              className="px-3 py-1 border rounded-r"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {product.stock} items available
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            product.stock === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-amber-700 text-white hover:bg-amber-800'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductPage
