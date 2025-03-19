import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'

const CartSummary = () => {
  const { cart, total } = useContext(CartContext)
  const { currentUser } = useContext(AuthContext)

  const tax = total * 0.08
  const shipping = total > 0 ? 5.99 : 0
  const grandTotal = total + tax + shipping

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>
            Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)}{' '}
            items)
          </span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {cart.length > 0 && (
        <Link
          to={currentUser ? '/checkout' : '/login?redirect=checkout'}
          className="w-full bg-amber-700 text-white text-center py-2 px-4 rounded mt-4 block hover:bg-amber-800 transition"
        >
          {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
        </Link>
      )}
    </div>
  )
}

export default CartSummary