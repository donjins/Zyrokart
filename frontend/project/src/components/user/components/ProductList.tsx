import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  brand: string;
  images: string[];
  offerPrice: number;
  originalPrice: number;
  storage?: string;
  description: string;
}

const ProductList: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/product/${id}`
          );
          setProduct(response.data);
        } catch (error) {
          console.error("🔴 Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-lg p-6">
        <div className="flex-shrink-0">
          <img
            src={`http://localhost:5000/${product.images[0]}`}
            alt={product.name}
            className="w-64 h-64 object-contain rounded-lg shadow-md"
          />
        </div>
        <div className="flex-1 sm:ml-8 mt-6 sm:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">{product.brand}</p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-3xl font-semibold text-green-600">
              ₹{product.offerPrice}
            </span>
            <span className="text-xl text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="text-green-500 text-xl">
              {Math.round(
                ((product.originalPrice - product.offerPrice) / product.originalPrice) * 100
              )}
              % off
            </span>
          </div>

          <p className="mt-4 text-lg text-gray-700">
            {product.storage || "Expandable"}
          </p>

          <div className="mt-6 text-gray-600">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="mt-2 text-sm leading-relaxed">
              {product.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
