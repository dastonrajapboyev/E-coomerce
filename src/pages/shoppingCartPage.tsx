import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Spinner,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { title } from "@/components/primitives";
import { useCart } from "@/Context/CartContext";
import DefaultLayout from "@/layouts/default";

export default function CartPage() {
  const [loading, setLoading] = useState(false);

  const {
    cart: cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
  } = useCart();

  // Handle checkout process
  const handleCheckout = () => {
    setLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setLoading(false);
      clearCart();
      alert("Xaridingiz uchun rahmat! Buyurtmangiz qabul qilindi.");
    }, 2000);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className={title({ size: "lg" })}>Xarid savatchangiz</h1>

        {cartItems?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Savatchangiz bo'sh</h3>
            <p className="text-gray-500 mb-6">Hali mahsulot qo'shmagansiz</p>
            <Button as={Link} to="/products" color="primary">
              Xarid qilishni boshlang
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 text-sm font-medium border-b pb-2 mb-4 hidden md:grid mt-8">
              <div className="col-span-6">Mahsulot</div>
              <div className="col-span-2 text-center">Narxi</div>
              <div className="col-span-2 text-center">Miqdori</div>
              <div className="col-span-2 text-center">Jami</div>
            </div>

            {cartItems?.map((item) => (
              <Card
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="mb-4">
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Product details */}
                    <div className="md:col-span-6 flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.selectedSize && `O'lcham: ${item.selectedSize}`}
                          {item.selectedColor && item.selectedSize && " | "}
                          {item.selectedColor && `Rang: ${item.selectedColor}`}
                        </p>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          className="mt-2 p-0"
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }>
                          O'chirish
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 flex items-center justify-center">
                      <span className="md:hidden font-medium mr-2">Narxi:</span>
                      <span>
                        {parseInt(item.price).toLocaleString("uz-UZ")} so'm
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex items-center md:justify-center">
                      <span className="md:hidden font-medium mr-2">
                        Miqdori:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          color="default"
                          variant="flat"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                              "decrement"
                            )
                          }
                          isDisabled={item.quantity <= 1}>
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          isIconOnly
                          color="default"
                          variant="flat"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                              "increment"
                            )
                          }>
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="md:col-span-2 flex items-center justify-center">
                      <span className="md:hidden font-medium mr-2">Jami:</span>
                      <span className="font-semibold">
                        {parseInt(item.price * item.quantity).toLocaleString(
                          "uz-UZ"
                        )}{" "}
                        so'm
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Order summary */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="font-bold">Buyurtma ma'lumotlari</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mahsulotlar narxi:</span>
                    <span>
                      {parseInt(getTotal()).toLocaleString("uz-UZ")} so'm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yetkazib berish:</span>
                    <span>Bepul</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Jami to'lov:</span>
                    <span>
                      {parseInt(getTotal()).toLocaleString("uz-UZ")} so'm
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button color="danger" variant="flat" onClick={clearCart}>
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
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
