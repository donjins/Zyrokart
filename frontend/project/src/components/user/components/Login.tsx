import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginProps {
  onSignupClick: () => void;
}

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onSignupClick }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: formData.email, password: formData.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensure cookies/session work
        }
      );
  
      console.log("Full response from backend:", response);
  
      if (response.data && response.data.user) {
        console.log("Before saving, localStorage:", localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("After saving, localStorage:", localStorage.getItem("user"));
        navigate("/");
      } else {
        throw new Error("No user data received");
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data);
      if (error.response?.status === 401) {
        setErrors({ general: "Invalid email or password." });
      } else {
        setErrors({ general: error.response?.data?.message || "Something went wrong. Try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <AuthLayout title="Welcome back!" subtitle="Log in to your ZyroKart account">
      {errors.general && <p className="text-red-500">{errors.general}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <motion.a whileHover={{ scale: 1.05 }} href="#forgot-password" className="text-sm text-purple-600 hover:text-purple-500">
            Forgot password?
          </motion.a>
        </div>

        <Button type="submit" isLoading={isLoading}>Log in</Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" type="button">
          <Github className="w-5 h-5 mr-2" />
          Continue with GitHub
        </Button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <motion.button
            type="button"
            onClick={onSignupClick}
            whileHover={{ scale: 1.05 }}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign up
          </motion.button>
        </p>
      </form>
    </AuthLayout>
  );
};

export { Login };
