import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Typelar
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
    product: any,
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

// ✅ Default qiymat `undefined`
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: any,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
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

  const removeItem = (
    id: number | string,
    selectedSize: string,
    selectedColor: string
  ) => {
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

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getItemCount = () => cart.reduce((acc, item) => acc + item.quantity, 0);

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
