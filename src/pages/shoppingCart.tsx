import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Image,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { useCart } from "@/Context/CartContext";

export default function ShoppingCart() {
  const { cart: cartItems, clearCart, getTotal } = useCart();

  // Mini cart in popover
  const MiniCart = () => (
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
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex items-center gap-3 py-2">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">
                    {item.selectedSize && `O'lcham: ${item.selectedSize}`}
                    {item.selectedColor && item.selectedSize && " | "}
                    {item.selectedColor && `Rang: ${item.selectedColor}`}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span>
                      {item.price.toString().toLocaleString()} so&apos;m
                    </span>
                    <p className="text-xs">x{item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between py-2">
            <span className="font-medium">Jami:</span>
            <span className="font-semibold">
              {getTotal().toString().toLocaleString()} so&apos;m
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
            <Button
              color="danger"
              variant="light"
              size="sm"
              onClick={clearCart}>
              Tozalash
            </Button>
          </div>
        </>
      )}
    </div>
  );

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
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
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
