import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'

const CartPage = () => {
  const { cart } = useContext(CartContext)

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link
          to="/"
          className="bg-amber-700 text-white py-2 px-6 rounded-lg hover:bg-amber-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}

export default CartPage