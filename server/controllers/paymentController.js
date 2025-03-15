exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentDetails } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.paymentStatus = 'completed'
    order.status = 'processing'
    await order.save()

    res.json({
      success: true,
      message: 'Payment processed successfully',
      order,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Payment processing error' })
  }
}
