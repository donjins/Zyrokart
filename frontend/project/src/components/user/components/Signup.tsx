import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";


export function Signup({ onLoginClick }: { onLoginClick?: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
  
    const name = (e.target as HTMLFormElement).elements.namedItem("name") as HTMLInputElement;
    const email = (e.target as HTMLFormElement).elements.namedItem("email") as HTMLInputElement;
    const password = (e.target as HTMLFormElement).elements.namedItem("password") as HTMLInputElement;
  
    if (!name?.value || !email?.value || !password?.value) {
      setErrors({ general: "All fields are required" });
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: name.value,
        email: email.value,
        password: password.value,
      });
  
      if (response.data.success) {
        navigate("/otp-verification", { state: { email: email.value } });
      } else {
        setErrors({ general: response.data.message });
      }
    } catch (err) {
      setErrors({ general: "Signup failed. Try again later." });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthLayout title="Create your account" subtitle="Start your journey with ZyroKart">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && <p className="text-red-500">{errors.general}</p>}

        <Input label="Full Name" type="text" name="name" placeholder="John Doe" error={errors.name} />
        <Input label="Email" type="email" name="email" placeholder="you@example.com" error={errors.email} />
        <Input label="Password" type="password" name="password" placeholder="••••••••" error={errors.password} />

        <p className="text-sm text-gray-600">
          By signing up, you agree to our{" "}
          <a href="#terms" className="text-purple-600 hover:text-purple-500">Terms of Service</a>{" "}
          and{" "}
          <a href="#privacy" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>.
        </p>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

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
          Already have an account?{" "}
          <motion.button
            type="button"
            onClick={onLoginClick}
            whileHover={{ scale: 1.05 }}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Log in
          </motion.button>
        </p>
      </form>
    </AuthLayout>
  );
}

