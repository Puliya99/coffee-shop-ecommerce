import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || '/placeholder-coffee.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-2 text-sm line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard