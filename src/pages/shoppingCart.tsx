import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Image,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: string;
  brand: string;
  colors: string[];
  size: string[];
  productImages: Array<{
    id: string;
    image: string;
  }>;
}

interface CartItem {
  id: string;
  basket_id: string;
  product_id: string;
  color: string;
  count: number;
  size: string;
  price: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        setLoading(false);
        return;
      }

      const token = extractToken(tokenData);
      const response = await fetch("https://api.sentrobuv.uz/baskets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (
          data.message === "jwt expired" ||
          data.message === "jwt malformed"
        ) {
          localStorage.removeItem("token");
          return;
        }
        throw new Error(data.message || "Xatolik yuz berdi");
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const basketItems = data[0]?.basketItems;
        if (Array.isArray(basketItems)) {
          setCartItems(basketItems);
        }
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractToken = (tokenData: string): string => {
    try {
      const parsedToken = JSON.parse(tokenData);
      if (parsedToken && parsedToken.tokens) {
        return parsedToken.tokens.accessToken;
      } else if (parsedToken && parsedToken.accessToken) {
        return parsedToken.accessToken;
      }
      return tokenData;
    } catch {
      return tokenData;
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.count, 0);
  };

  // Mini cart in popover
  const MiniCart = () => {
    const displayedItems = cartItems.slice(0, 2);
    const remainingCount = Math.max(0, cartItems.length - 2);
    <h1>loading; {loading}</h1>;

    return (
      <div className="w-full">
        {cartItems.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Savatchangiz bo&apos;sh</p>
            <Button
              as={Link}
              to="/products"
              color="primary"
              variant="flat"
              size="sm"
              className="mt-2">
              Xarid qilishni boshlang
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto">
              {displayedItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center gap-3 py-2">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={`https://api.sentrobuv.uz/${item.product.productImages[0]?.image}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-medium truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.size && `O'lcham: ${item.size}`}
                      {item.color && item.size && " | "}
                      {item.color && `Rang: ${item.color}`}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span>{item.price.toLocaleString()} so&apos;m</span>
                      <p className="text-xs">x{item.count}</p>
                    </div>
                  </div>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  +{remainingCount}
                </div>
              )}
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between py-2">
              <span className="font-medium">Jami:</span>
              <span className="font-semibold">
                {getTotal().toLocaleString()} so&apos;m
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                color="primary"
                className="flex-1"
                size="sm"
                as={Link}
                to="/cart">
                Savatchani ko&apos;rish
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Savatcha">
          🛒
          {cartItems?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((acc, item) => acc + item.count, 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="px-1 py-2">
          <h3 className="text-lg font-bold mb-2">Savatcha</h3>
          <MiniCart />
        </div>
      </PopoverContent>
    </Popover>
  );
}
