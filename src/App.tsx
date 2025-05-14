import { Routes, Route } from "react-router-dom";
import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import ProductsPage from "./pages/productsPage";
import ProductDetailPage from "./pages/productDetailPage";
import { CartProvider } from "./Context/CartContext";
import CartPage from "./pages/shoppingCartPage";

import SignIn from "@/pages/signIn";
import SignUp from "@/pages/signUp";
function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<ProductsPage />} path="/products" />
        <Route element={<ProductDetailPage />} path="/product/:id" />{" "}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
