import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/orders/recent'),
        ])

        setStats(statsRes.data)
        setRecentOrders(ordersRes.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Products
          </h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/product"
            className="bg-amber-700 text-white p-4 rounded-lg hover:bg-amber-800 transition text-center"
          >
            Add New Product
          </Link>
          <Link
            to="/admin/orders"
            className="bg-gray-700 text-white p-4 rounded-lg hover:bg-gray-800 transition text-center"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className="bg-gray-700 text-white p-4 rounded-lg hover:bg-gray-800 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-amber-700 hover:text-amber-900"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4">{order._id.substring(0, 8)}</td>
                  <td className="py-2 px-4">{order.user.name}</td>
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
                      to={`/admin/order/${order._id}`}
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
      </div>
    </div>
  )
}

export default AdminDashboardPage