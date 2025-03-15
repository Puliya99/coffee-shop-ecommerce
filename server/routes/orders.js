const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const paymentController = require('../controllers/paymentController')
const { verifyToken, isAdmin } = require('../middleware/auth')

router.post('/', verifyToken, orderController.createOrder)
router.get('/myorders', verifyToken, orderController.getUserOrders)
router.get('/:id', verifyToken, orderController.getOrderById)
router.post('/payment', verifyToken, paymentController.processPayment)

router.get('/', verifyToken, isAdmin, orderController.getAllOrders)
router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  orderController.updateOrderStatus
)

module.exports = router