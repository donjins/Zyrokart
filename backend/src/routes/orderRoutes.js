const express = require('express');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const Product = require('../models/product');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET, // Your Razorpay secret key
});

// ========================
// Create Razorpay Order
// ========================
router.post('/create-order', async (req, res) => {
  try {
    const { customerEmail, customerName, customerPhone, checkoutAddress, cartId } = req.body;

    // Validate cart ID existence (assuming you have a cart model to track cart items)
    if (!cartId) {
      return res.status(400).json({ message: 'Cart ID is required' });
    }

    // Calculate total amount based on cart ID (you could fetch cart items here if needed)
    // For now, we assume the cart total is already provided
    const totalAmount = req.body.totalAmount; // Total amount should be passed with the request

    // Create Razorpay order
    const paymentOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
    });

    // Save order to database with cartId, address and payment status as 'Pending'
    const newOrder = new Order({
      cartId,
      customerEmail,
      customerName,
      customerPhone,
      checkoutAddress,
      totalAmount,
      razorpayOrderId: paymentOrder.id,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      razorpayOrderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// ========================
// Handle Razorpay Payment Verification
// ========================
router.post('/verify-payment', async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  // Verify the payment signature
  const generatedSignature = razorpay.crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  if (generatedSignature === signature) {
    try {
      // Update order status to 'Paid'
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { paymentStatus: 'Paid', orderStatus: 'Completed' },
        { new: true }
      );

      res.status(200).json({ message: 'Payment verification successful', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
