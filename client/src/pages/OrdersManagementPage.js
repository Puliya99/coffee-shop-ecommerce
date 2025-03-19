import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const OrdersManagementPage = () => {
  const { authToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  useEffect(() => {
    fetchOrders()
  }, [filterStatus, page, authToken])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        status: filterStatus !== 'all' ? filterStatus : '',
        page,
        limit: 10,
        search: searchTerm,
      })

      const response = await fetch(`/api/orders?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch orders')

      const data = await response.json()
      setOrders(data.orders)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Error loading orders: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page
    fetchOrders()
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order status')

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err) {
      setError('Error updating status: ' + err.message)
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
  }

  const closeDetails = () => {
    setSelectedOrder(null)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
          <button
            className="ml-4 text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setPage(1) // Reset to first page when filter changes
              }}
              className="block w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row md:items-end"
          >
            <div className="mb-4 md:mb-0 md:mr-4">
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Orders
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Order ID or Customer Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderNumber || order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {statusOptions
                            .filter((option) => option.value !== 'all')
                            .map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(page - 1) * 10 + 1}</span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(page * 10, orders.length)}
                    </span>{' '}
                    of <span className="font-medium">{totalPages * 10}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {[...Array(totalPages).keys()].map((num) => (
                      <button
                        key={num + 1}
                        onClick={() => setPage(num + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          page === num + 1
                            ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {num + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Order #
                {selectedOrder.orderNumber || selectedOrder.id.substring(0, 8)}
              </h3>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Customer Information
                  </h4>
                  <p className="text-gray-700">
                    Name: {selectedOrder.customer.name}
                  </p>
                  <p className="text-gray-700">
                    Email: {selectedOrder.customer.email}
                  </p>
                  <p className="text-gray-700">
                    Phone: {selectedOrder.customer.phone}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Order Details
                  </h4>
                  <p className="text-gray-700">
                    Date: {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p className="text-gray-700">
                    Status:
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    Payment Method: {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Shipping Address
                </h4>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.street}
                </p>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.zipCode}
                </p>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress.country}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">
                    {formatPrice(selectedOrder.shipping)}
                  </span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">
                      {formatPrice(selectedOrder.tax)}
                    </span>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-gray-900">
                      -{formatPrice(selectedOrder.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg mt-4">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                  <p className="text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div className="flex space-x-2">
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions
                    .filter((option) => option.value !== 'all')
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() =>
                    handleStatusChange(selectedOrder.id, selectedOrder.status)
                  }
                >
                  Update Status
                </button>
              </div>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersManagementPage
