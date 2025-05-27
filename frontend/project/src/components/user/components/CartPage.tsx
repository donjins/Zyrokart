import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../../types";
import axios from "axios";


const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartWithDetails = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }
  
        const user = JSON.parse(storedUser);
        const userId = user.id || user._id;
  
        if (!userId) {
          console.error("User ID is missing");
          setLoading(false);
          return;
        }
  
        setUserId(userId);
  
        const cartRes = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          withCredentials: true,
        });
  
        const cartData = cartRes.data.cart || cartRes.data;
        setCartId(cartData._id || null);
  
        if (!Array.isArray(cartData.items)) {
          console.error("Expected cart items to be an array, got:", cartData.items);
          setCartItems([]);
          return;
        }
  
        const detailedItems = await Promise.all(
          cartData.items.map(async (item: any) => {
            const productId = typeof item.product === "object" ? item.product._id : item.product;
            const productRes = await axios.get(`http://localhost:5000/api/product/${productId}`);
            return { ...item, product: productRes.data };
          })
        );
  
        setCartItems(detailedItems);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartWithDetails();
  }, []);
  
  const updateQuantity = async (itemId: string, productId: string, change: number) => {
    if (!userId) return;

    const item = cartItems.find((i) => i.product._id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      await removeItem(itemId, productId);  // Call removeItem function to remove the item
      return;  // Exit the function early since the item is removed
    }
    setUpdating(itemId);

    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${itemId}`,
        {
          userId,
          cartItemId: itemId,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      const cartRes = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
        withCredentials: true,
      });

      const cartData = cartRes.data.cart || cartRes.data;
      const detailedItems = await Promise.all(
        cartData.items.map(async (item: any) => {
          const productId = typeof item.product === "object" ? item.product._id : item.product;
          const productRes = await axios.get(`http://localhost:5000/api/product/${productId}`);
          return { ...item, product: productRes.data };
        })
      );

      setCartItems(detailedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: string, productId: string) => {
    setUpdating(cartItemId);
  
    const storedUser = localStorage.getItem("user");
  
    try {
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userId = user._id;
  
        const res = await axios.delete(`http://localhost:5000/api/cart/remove/${cartItemId}`, {
          params: {
            productId,
            userId
          }
        });
  
        // Log the full response to see what's coming back
        console.log('Response:', res.data); 
  
        if (res.data.message === "Item removed") {
          // Trigger a full page reload after the item is successfully removed
          alert("Item successfully removed from the cart!");  // Optionally show a success message to the user
          window.location.reload(); // This will reload the entire page
        } else {
          alert("Failed to remove item: " + res.data.message); // Show error if not successful
        }
      } else {
        console.error("User not found in localStorage");
        // Optionally redirect to login or show error
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("An error occurred while removing the item. Please try again.");
    } finally {
      setUpdating(null);
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.offerPrice || 0) * item.quantity,
      0
    );
  };

  const placeOrder = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/payment");
    // setCurrentStep('payment');
  };

  if (loading) return <div className="text-center p-4">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-violet-800 mb-10 tracking-tight">
         Your Cart
        </h1>
  
        {cartItems.length === 0 ? (
          <div className="text-center text-violet-600 space-y-4">
            <p className="text-2xl">Your cart is currently empty.</p>
            <button
              onClick={() => navigate("/")}
              className="inline-block px-6 py-3 bg-violet-600 text-white rounded-full font-semibold shadow hover:bg-violet-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-violet-200 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition"
              >
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-semibold text-violet-900">{item.product?.name}</h2>
                  <p className="text-violet-500">₹{item.product?.offerPrice} × {item.quantity}</p>
                </div>
  
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.product._id, -1)}
                    disabled={updating === item._id}
                    className="w-9 h-9 text-lg bg-violet-100 text-violet-800 rounded-full hover:bg-violet-200 transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.product._id, 1)}
                    disabled={updating === item._id}
                    className="w-9 h-9 text-lg bg-violet-100 text-violet-800 rounded-full hover:bg-violet-200 transition"
                  >
                    +
                  </button>
                </div>
  
                <div className="text-right">
                  <p className="text-lg font-bold text-violet-700">
                    ₹{(item.product?.offerPrice || 0) * item.quantity}
                  </p>
                  <button
                    onClick={() => removeItem(item._id, item.product._id)}
                    disabled={updating === item._id}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
  
            <div className="bg-white rounded-2xl shadow-md border border-violet-200 p-6 mt-8 text-center">
              <h3 className="text-2xl font-bold text-violet-900 mb-2">Total: ₹{calculateTotal()}</h3>
              <button
                onClick={placeOrder}
                className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold py-3 rounded-full transition"
              >
                🧾 Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  
    

export default CartPage;
