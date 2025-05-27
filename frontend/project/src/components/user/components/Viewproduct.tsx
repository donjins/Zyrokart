import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactImageMagnify from "react-image-magnify";
import "./ViewProduct.css";

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  images: string[];
  stock: number;
  rating: number;
  description: string;
}

const ViewProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.images[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
      const session = await fetchSession();
      if (!session || !session.user || !session.user.id) {
        alert("User not logged in");
        return;
      }

      const userId = session.user.id;

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          productId: product?._id,
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

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="flex max-w-6xl mx-auto mt-10 p-6 gap-6">
      {/* Left Side - Image Gallery */}
      <div className="w-1/2 flex flex-col items-center">
        <div className="w-[400px] h-[450px]">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: product.name,
                isFluidWidth: true,
                src: `http://localhost:5000/${selectedImage}`,
              },
              largeImage: {
                src: `http://localhost:5000/${selectedImage}`,
                width: 1200,
                height: 1200,
              },
              enlargedImageContainerDimensions: {
                width: "200%",
                height: "200%",
              },
              enlargedImagePosition: "over",
            }}
          />
        </div>

        {/* Thumbnail Images */}
        <div className="flex mt-4 space-x-2">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000/${img}`}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                selectedImage === img ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Product Details */}
      <div className="w-1/2 h-[500px] overflow-y-auto border-l pl-6">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.brand}</p>
        <div className="flex items-center my-2">
          <span className="text-xl font-bold text-green-600">₹{product.offerPrice}</span>
          <span className="ml-2 text-gray-500 line-through">₹{product.originalPrice}</span>
          <span className="ml-2 text-green-500 text-sm">
            ({Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)}% off)
          </span>
        </div>
        <p className="text-gray-700 mt-4">
          {product.description.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className="mt-4 flex gap-4">
          <button
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={addToCart}
          >
            Add to Cart
          </button>
          <button className="px-5 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;

