import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Products from "./components/Product";
import { AddProduct } from "../AddProduct";
import { Orders } from "../Orders";
import { Users } from "../Users";
import { UserRoutes } from "./components/user/routes/UserRoutes";
import { AdminRoutes } from "./components/admin/routes/AdminRoutes";
import { Login } from "./components/user/components/Login";
import { Signup } from "./components/user/components/Signup";
import { OTPVerification } from "./components/user/components/OTPVerification";
import ViewProduct from "./components/user/components/Viewproduct";
import CartPage from "./components/user/components/CartPage";
import Payment from "./components/user/components/paymentcomponents/PaymentPage";
import ProductList from "./components/user/components/ProductList";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* User Routes - Use "/*" to allow child routes */}
          <Route path="/*" element={<UserRoutes />} />
         

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/signup" element={<SignupWrapper />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/ViewProduct/:id" element={<ViewProduct />} />
          <Route path="/Cart/:id" element={<CartPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route  path="/productlist/:id" element={<ProductList />} />


          {/* Admin Routes - Use "/*" to allow child routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Other Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />

          {/* Catch-All Route (404) */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  return <Login onSignupClick={() => navigate("/signup")} />;
}

function SignupWrapper() {
  const navigate = useNavigate();
  return <Signup onLoginClick={() => navigate("/login")} />;
}

export default App;
