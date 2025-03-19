import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const UserDashboardPage = () => {
  const { currentUser } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/user')
        setOrders(res.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again later.')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="mb-2">
              <span className="font-medium">Name:</span> {currentUser.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> {currentUser.email}
            </p>
            <button className="mt-4 text-amber-700 hover:text-amber-900">
              Edit Information
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>

            {loading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Order ID</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Total</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b">
                        <td className="py-2 px-4">
                          {order._id.substring(0, 8)}
                        </td>
                        <td className="py-2 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">${order.total.toFixed(2)}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <Link
                            to={`/order/${order._id}`}
                            className="text-amber-700 hover:text-amber-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboardPage