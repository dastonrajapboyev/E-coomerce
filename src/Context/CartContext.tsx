import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Typings
interface Product {
  id: number | string;
  name: string;
  price: string | number;
  brand: string;
  productImages?: Array<{
    image: string;
  }>;
}

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => void;
  updateQuantity: (
    id: number | string,
    selectedSize: string,
    selectedColor: string,
    action: "increment" | "decrement"
  ) => void;
  removeItem: (
    id: number | string,
    selectedSize: string,
    selectedColor: string
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

// ✅ Fixed: Explicitly typed children
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.error("Invalid cart data in localStorage");
          setCart([]);
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => {
    if (quantity <= 0) {
      console.error("Quantity must be greater than 0");
      return;
    }

    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;

    if (isNaN(price)) {
      console.error("Invalid price value");
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price,
      quantity,
      selectedSize,
      selectedColor,
      image: product.productImages?.[0]?.image
        ? `https://api.sentrobuv.uz/${product.productImages[0].image}`
        : "https://via.placeholder.com/150",
    };

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.selectedSize === cartItem.selectedSize &&
        item.selectedColor === cartItem.selectedColor
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart((prevCart) => [...prevCart, cartItem]);
    }
  };

  const updateQuantity = (
    id: number | string,
    selectedSize: string,
    selectedColor: string,
    action: "increment" | "decrement"
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          const newQuantity =
            action === "increment"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (
    id: number | string,
    selectedSize: string,
    selectedColor: string
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  const clearCart = () => {
    try {
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  };

  const getTotal = () =>
    cart.reduce((acc, item) => {
      const itemTotal = item.price * item.quantity;
      return acc + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);

  const getItemCount = () =>
    cart.reduce(
      (acc, item) => acc + (item.quantity > 0 ? item.quantity : 0),
      0
    );

  const value: CartContextType = {
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

// ✅ Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
