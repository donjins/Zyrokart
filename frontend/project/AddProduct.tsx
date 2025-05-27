import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "iPhone", // Default brand
    originalPrice: "",
    offerPrice: "",
    stock: "",
    images: [],
  });

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files).slice(0, 3));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!formData.name || !formData.brand || !formData.originalPrice || !formData.offerPrice || !formData.stock || imageFiles.length === 0) {
      setError("Please fill in all required fields and upload at least one image.");
      return;
    }
  
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`Appending: ${key} => ${value}`); // Debugging
      formDataObj.append(key, value.toString());
    });
  
    imageFiles.forEach((file) => {
      console.log(`Appending Image: ${file.name}`); // Debugging
      formDataObj.append("images", file);
    });
  
    try {
      const response = await fetch("http://localhost:5000/api/product/add-product", {
        method: "POST",
        body: formDataObj, // ✅ Don't set Content-Type manually
      });
  
      if (!response.ok) throw new Error("Failed to create product");
  
      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    }
  };


  
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md h-[80vh] overflow-y-scroll">
      <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
      <p className="mt-2 text-sm text-gray-700">Create a new product for your store.</p>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
            rows={3} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <select 
            name="brand" 
            value={formData.brand} 
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-red-500" 
            required
          >
            <option value="">Select a Brand</option>
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Original Price ($)</label>
          <input 
            type="number" 
            value={formData.originalPrice} 
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
            step="0.01" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Price ($)</label>
          <input 
            type="number" 
            value={formData.offerPrice} 
            onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
            step="0.01" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input 
            type="number" 
            value={formData.stock} 
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Product Images (Max 3)</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
            className="block w-full mt-2 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
          />
          

        </div>

        <div className="flex justify-end gap-x-3">
          <button 
            type="button" 
            onClick={() => navigate("/products")} 
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
