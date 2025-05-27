import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Phone {
  _id: string;
  name: string;
  images: string[];
  rating: number;
  offerPrice: number;
  originalPrice?: number;
}

interface PhoneCardProps {
  phone: Phone;
}

export function PhoneCard({ phone }: PhoneCardProps) {
  const navigate = useNavigate();

  const fetchSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/session", {
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  };

  const addToCart = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("User not logged in");
        return;
      }

  
      const user = JSON.parse(storedUser);
      const userId = user._id;
  
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          productId: phone._id,
          quantity: 1,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Item added to cart!");
        navigate(`/cart/${userId}`);
      } else {
        alert(`Failed to add to cart: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="flex-none w-72 mr-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <img
        src={`http://localhost:5000/${phone.images[0]}`}
        alt={phone.name}
        onClick={() => navigate(`/ViewProduct/${phone._id}`)}
        className="w-full h-48 object-contain p-4 cursor-pointer"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{phone.name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-sm">{phone.rating}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-bold">₹{phone.offerPrice}</span>
          {phone.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{phone.originalPrice}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={addToCart}
          >
            Add to Cart
          </button>

          <button className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
