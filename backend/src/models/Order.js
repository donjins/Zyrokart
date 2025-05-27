const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartId: { type: String, required: true }, // Save the cart ID
  customerEmail: String,
  customerName: String,
  customerPhone: String,
  checkoutAddress: {
    address: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
  },
  totalAmount: Number,
  razorpayOrderId: String,
  orderStatus: { type: String, default: 'Pending' },
  paymentStatus: { type: String, default: 'Pending' }, // Keep track of payment status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
