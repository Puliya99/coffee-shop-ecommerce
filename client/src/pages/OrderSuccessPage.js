import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccessPage = () => {
  const location = useLocation()
  const orderId = location.state?.orderId || 'N/A'

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
      <p className="text-gray-600 mb-2">Thank you for your order.</p>
      <p className="text-gray-600 mb-8">
        Your order number is: <span className="font-medium">{orderId}</span>
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/"
          className="bg-amber-700 text-white py-2 px-6 rounded-lg hover:bg-amber-800 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/my-account"
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccessPage