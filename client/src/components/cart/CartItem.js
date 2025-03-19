import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext)

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.image || '/placeholder-coffee.jpg'}
          alt={item.name}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div className="ml-4 flex-grow">
        <Link
          to={`/product/${item.id}`}
          className="font-medium hover:text-amber-700"
        >
          {item.name}
        </Link>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1 border rounded-l"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-2 py-1 border rounded-r"
        >
          +
        </button>
      </div>

      <div className="ml-4 text-right">
        <p className="font-medium">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 text-sm hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem