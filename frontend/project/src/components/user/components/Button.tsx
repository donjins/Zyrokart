import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  variant?: "primary" | "outline";
}

export function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400",
    outline:
      "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 disabled:border-purple-400 disabled:text-purple-400",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
