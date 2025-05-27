import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  LogIn,
  LogOut,
  User,
  Settings,
  PackageCheck,
} from "lucide-react";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/session", {
        withCredentials: true,
      });
      if (response.data?.user) {
        setUser(response.data.user);
        setIsSessionValid(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setIsSessionValid(false);
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setIsSessionValid(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const handleLogin = () => {
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsSessionValid(false);
    setIsDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim()) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/product/search/${encodeURIComponent(searchQuery)}`
          );
          setSuggestions(res.data || []);
        } catch (err) {
          console.error("Suggestion fetch failed:", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300); // debounce input
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSuggestionClick = (productId: string) => {
    navigate(`/productlist/${productId}`);
    setSuggestions([]);
    setSearchQuery("");
  };

  const handleSearchClick = async () => {
    if (searchQuery.trim() !== "") {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/search/${encodeURIComponent(searchQuery)}`
        );
        if (response.data && response.data.length > 0) {
          navigate(`/productlist/${response.data[0]._id}`);
        } else {
          console.log("❌ Product not found");
        }
      } catch (error) {
        console.error("🔴 Error searching product:", error);
      }
    } else {
      console.warn("⚠️ Search query is empty.");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50 border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            ZyroKart
          </h1>

          {/* Search Bar with Autocomplete */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <Autocomplete
              freeSolo
              options={suggestions.map((item: any) => item.name)}
              onInputChange={(event, value) => {
                setSearchQuery(value);
              }}
              onChange={(event, value) => {
                const selectedProduct = suggestions.find((item: any) => item.name === value);
                if (selectedProduct) {
                  handleSuggestionClick(selectedProduct._id);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search for phones..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Search
                        className="text-gray-400 cursor-pointer"
                        size={20}
                        onClick={handleSearchClick}
                      />
                    ),
                  }}
                />
              )}
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
          <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => navigate("/cart/67e14343e36fccb687e4fa90")}
            >
              <ShoppingCart size={20} className="text-dark-600" />
            </button>
            <div className="relative cursor-pointer">
              <Heart className="text-xl hover:text-red-500 transition-colors duration-300" />
            </div>
            <div className="relative cursor-pointer">
              <Bell className="text-xl hover:text-yellow-500 transition-colors duration-300" />
            </div>

            {user ? (
              <div className="relative">
                <User
                  className="cursor-pointer text-xl hover:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-gray-700 font-semibold">{user.name}</div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => navigate("/orders")}
                    >
                      <PackageCheck size={16} /> My Orders
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings size={16} /> Settings
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} /> Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:bg-gradient-to-l transition-all duration-300"
                onClick={handleLogin}
              >
                <LogIn size={18} /> Login
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
