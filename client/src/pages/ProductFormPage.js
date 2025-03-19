import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  })

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode) {
        try {
          const res = await axios.get(`/api/products/${id}`)
          setFormData({
            name: res.data.name,
            description: res.data.description,
            price: res.data.price,
            category: res.data.category,
            stock: res.data.stock,
            image: res.data.image,
          })
          setLoading(false)
        } catch (err) {
          console.error('Error fetching product:', err)
          setError('Failed to load product data. Please try again.')
          setLoading(false)
        }
      }
    }

    fetchProduct()
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    setError('')

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      }

      if (isEditMode) {
        await axios.put(`/api/products/${id}`, productData)
      } else {
        await axios.post('/api/products', productData)
      }

      navigate('/admin')
    } catch (err) {
      console.error('Error saving product:', err)
      setError('Failed to save product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-lg"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-2"
            >
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Category</option>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="equipment">Equipment</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-gray-700 font-medium mb-2"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="image"
            className="block text-gray-700 font-medium mb-2"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="Product preview"
                className="h-32 w-32 object-cover rounded border"
                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : isEditMode
              ? 'Update Product'
              : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductFormPage