import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Spinner,
  Divider,
} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

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

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        setError("Xarid qilish uchun avval tizimga kiring");
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
          setError("Sizning sessiyangiz tugagan. Iltimos, qaytadan kiring.");
          navigate("/signin");
          return;
        }
        throw new Error(data.message || "Xatolik yuz berdi");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      // Check if data is an array and has items
      if (Array.isArray(data) && data.length > 0) {
        const basketItems = data[0]?.basketItems;
        if (Array.isArray(basketItems)) {
          setCartItems(basketItems);
        } else {
          console.error("basketItems is not an array:", basketItems);
          setCartItems([]);
        }
      } else {
        console.log("No basket data found");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error instanceof Error ? error.message : "Xatolik yuz berdi");
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

  // Handle checkout process
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        alert("Xarid qilish uchun avval tizimga kiring");
        navigate("/signin");
        return;
      }

      const token = extractToken(tokenData);
      const response = await fetch("https://api.sentrobuv.uz/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.count,
            color: item.color,
            size: item.size,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Buyurtma yaratishda xatolik yuz berdi"
        );
      }

      alert("Xaridingiz uchun rahmat! Buyurtmangiz qabul qilindi.");
      setCartItems([]);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(error instanceof Error ? error.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Add type for item parameter
  const handleRemoveItem = async (item: CartItem) => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        alert("Xarid qilish uchun avval tizimga kiring");
        navigate("/signin");
        return;
      }

      const token = extractToken(tokenData);
      const response = await fetch(
        `https://api.sentrobuv.uz/baskets/delete/basket-items/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Mahsulotni o'chirishda xatolik yuz berdi"
        );
      }

      // Fetch updated cart data after successful deletion
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      alert(error instanceof Error ? error.message : "Xatolik yuz berdi");
    }
  };

  // Add type for acc parameter
  const calculateTotal = cartItems.reduce((acc: number, item: CartItem) => {
    return acc + item.price * item.count;
  }, 0);

  const handleClearCart = async () => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        alert("Xarid qilish uchun avval tizimga kiring");
        navigate("/signin");
        return;
      }

      const token = extractToken(tokenData);
      const response = await fetch("https://api.sentrobuv.uz/baskets/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Savatchani tozalashda xatolik yuz berdi"
        );
      }

      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert(error instanceof Error ? error.message : "Xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" color="secondary" label="Yuklanmoqda..." />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className={title({ color: "foreground" })}>Xatolik</h2>
          <p className="text-lg">{error}</p>
          <Button as={Link} to="/signin" color="primary" className="mt-4">
            Tizimga kirish
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 ">
        <h1 className={title({ size: "lg" })}>Xarid savatchangiz</h1>

        {cartItems?.length === 0 ? (
          <div className="text-center py-12 ">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">
              Savatchangiz bo&apos;sh
            </h3>
            <p className="text-gray-500 mb-6">
              Hali mahsulot qo&apos;shmagansiz
            </p>
            <Button as={Link} to="/products" color="primary">
              Xarid qilishni boshlang
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="grid grid-cols-12 text-sm font-medium border-b pb-2 mb-4 hidden md:grid mt-8">
              <div className="col-span-6">Mahsulot</div>
              <div className="col-span-2 text-center">Narxi</div>
              <div className="col-span-4 text-center">Jami</div>
            </div>

            {cartItems?.map((item) => (
              <Card
                key={`${item.id}-${item.size}-${item.color}`}
                className="mb-4">
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Product details */}
                    <div className="md:col-span-6 flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={`https://api.sentrobuv.uz/${item.product.productImages[0]?.image}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.size && `O'lcham: ${item.size}`}
                          {item.color && item.size && " | "}
                          {item.color && `Rang: ${item.color}`}
                        </p>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          className="mt-2 p-0"
                          onClick={() => handleRemoveItem(item)}>
                          O&apos;chirish
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 flex items-center justify-center">
                      <span className="md:hidden font-medium mr-2">Narxi:</span>
                      <span>
                        {item.price.toLocaleString("uz-UZ")} so&apos;m
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="md:col-span-4 flex items-center justify-center">
                      <span className="md:hidden font-medium mr-2">Jami:</span>
                      <span className="font-semibold">
                        {(item.price * item.count).toLocaleString("uz-UZ")}{" "}
                        so&apos;m
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Order summary */}
            <Card className="mt-6">
              <CardFooter>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mahsulotlar narxi:</span>
                    <span>
                      {calculateTotal.toLocaleString("uz-UZ")} so&apos;m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yetkazib berish:</span>
                    <span>Bepul</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Jami to&apos;lov:</span>
                    <span>
                      {calculateTotal.toLocaleString("uz-UZ")} so&apos;m
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button color="danger" variant="flat" onClick={handleClearCart}>
                  Savatchani tozalash
                </Button>
                <Button as={Link} to="/products" variant="flat">
                  Xarid davom ettirish
                </Button>
              </div>
              <Button
                color="primary"
                onClick={handleCheckout}
                isLoading={loading}>
                {loading ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  "Buyurtma berish"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
