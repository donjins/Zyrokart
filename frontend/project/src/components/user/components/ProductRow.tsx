import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {PhoneCard }  from "./PhoneCard";
import { Phone } from "../../../types";

interface ProductRowProps {
  title: string;
  brand: string;
}

export function ProductRow({ title, brand }: ProductRowProps) {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product/get-products");
        console.log("Fetched products:", response.data);

        const filteredPhones = response.data.filter(
          (phone: Phone) => phone.brand === brand
        );
        console.log("Filtered phones:", filteredPhones);
        setPhones(filteredPhones);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brand]);

  if (loading) return <p>Loading {title}...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (phones.length === 0) return <p>No {title} available.</p>;

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative">
        <button
          onClick={() => {
            const container = document.getElementById(`scroll-${title}`);
            container?.scrollBy({ left: -400, behavior: "smooth" });
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div
          id={`scroll-${title}`}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {phones.map((phone, index) => (
            <PhoneCard key={index} phone={phone} />
          ))}
        </div>
        <button
          onClick={() => {
            const container = document.getElementById(`scroll-${title}`);
            container?.scrollBy({ left: 400, behavior: "smooth" });
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
