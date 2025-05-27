const express = require("express");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId are required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart }); // Success with cart data
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart", error });
  }
});


// Get cart items for a user
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.id }).populate("items.product");
    console.log(cart);
    res.json({ cart }); // Return full cart object
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Update quantity
router.put("/update/:cartId", async (req, res) => {
  const { userId, cartItemId, quantity } = req.body;

  if (!userId || !cartItemId || quantity === undefined) {
    return res.status(400).json({ message: "Missing userId, cartItemId, or quantity" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      {
        user: userId,
        "items._id": cartItemId,
      },
      {
        $set: { "items.$.quantity": quantity },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Remove item from cart
// Accept cartItemId as a param and productId as a query
router.delete('/remove/:cartItemId', async (req, res) => {
  try {
    const { productId, userId } = req.query;  // Ensure data is in query parameters or body as needed

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.cartItemId);

    await cart.save();
    // Respond with a success message
    res.status(200).json({ message: "Item removed" });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Payment
router.get('/payment', async (req, res) => {
  res.render('PaymentMethods', {
    title: 'Payment',
    user: req.session.user, // Pass the user data to the template
    cart: req.session.cart, // Pass the cart data to the template
  });
});

module.exports = router;
