import { Routes, Route } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroSlider } from "../components/HeroSlider";
import { ProductRow } from "../components/ProductRow";
import { AIChatbot } from "../components/AIChatbot";

export const UserRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ProductRow title="Latest iPhones" brand="iPhone" />
                <div className="mt-12">
                  <ProductRow title=" LatestSamsung" brand="Samsung" />
                </div>
              </main>
              <Footer />
              <AIChatbot />
            </>
          }
        />
      </Routes>
    </>
  );
};
