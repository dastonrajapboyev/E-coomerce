import { createContext, useState, useContext, useEffect } from "react";

// Create the context
const CartContext = createContext();

// Create the provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity, selectedSize, selectedColor) => {
    // Create a cart item object
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      image:
        product.productImages && product.productImages.length > 0
          ? `https://api.sentrobuv.uz/${product.productImages[0].image}`
          : "https://via.placeholder.com/150",
    };

    // Check if the item already exists in cart (with the same id, size, and color)
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.selectedSize === cartItem.selectedSize &&
        item.selectedColor === cartItem.selectedColor
    );

    if (existingItemIndex !== -1) {
      // If item exists, update its quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // If item doesn't exist, add it to cart
      setCart((prevCart) => [...prevCart, cartItem]);
    }
  };

  // Update quantity of an item in cart
  const updateQuantity = (id, selectedSize, selectedColor, action) => {
    const updatedCart = cart.map((item) => {
      if (
        item.id === id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      ) {
        if (action === "increment") {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === "decrement" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Remove an item from cart
  const removeItem = (id, selectedSize, selectedColor) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        )
    );
    setCart(updatedCart);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate the total price of items in the cart
  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Get the total number of items in the cart
  const getItemCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Create the context value
  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
