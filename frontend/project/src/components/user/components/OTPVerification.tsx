import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button";

export function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  if (!email) {
    navigate("/signup");
    return null;
  }

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Invalid OTP or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800">OTP Verification</h2>
        <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to {email}</p>

        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 text-xl text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Button onClick={handleVerifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
