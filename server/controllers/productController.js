const Product = require('../models/Product')

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.image = image || product.image
    product.category = category || product.category
    product.stock = stock || product.stock
    product.updatedAt = Date.now()

    await product.save()
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await product.remove()
    res.json({ message: 'Product removed' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}