import { useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  count: number;
}

export const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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
      setCartItems(data.basketItems || []);
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
    const interval = setInterval(fetchCartItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.count, 0);
  };

  return (
    <Popover
      placement="bottom-end"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Shopping cart">
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getTotalItems()}
          </span>
          🛒
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          {loading ? (
            <div className="text-center">Yuklanmoqda...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center">Savat bo&apos;sh</div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto">
                {cartItems.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 mb-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.count} x {item.product.price.toLocaleString()}{" "}
                        so&apos;m
                      </p>
                    </div>
                  </div>
                ))}
                {cartItems.length > 2 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    +{cartItems.length - 2}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button as={Link} to="/cart" color="primary" className="w-full">
                  Savatni ko&apos;rish
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
