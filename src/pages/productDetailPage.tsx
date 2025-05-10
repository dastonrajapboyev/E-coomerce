import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import {
  Image,
  Chip,
  Button,
  Tabs,
  Tab,
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  useDisclosure,
  Toast,
} from "@heroui/react";
import { title } from "@/components/primitives";
import { useCart } from "@/Context/CartContext";

interface ProductImage {
  id: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  size: string[];
  colors: string[];
  productImages: ProductImage[];
}

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  "dark-blue": "#00008B",
  blue: "#0000FF",
  red: "#FF0000",
  white: "#FFFFFF",
  green: "#008000",
  yellow: "#FFFF00",
  purple: "#800080",
  orange: "#FFA500",
  pink: "#FFC0CB",
  gray: "#808080",
  brown: "#A52A2A",
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.sentrobuv.uz/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);

        if (data.size?.length > 0) {
          setSelectedSize(data.size[0]);
        }
        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi");
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (action: "increment" | "decrement") => {
    if (action === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.size?.length > 0 && !selectedSize) {
      setToastMessage("Iltimos, o'lchamni tanlang");
      setToastType("error");
      onOpen();
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      setToastMessage("Iltimos, rangni tanlang");
      setToastType("error");
      onOpen();
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart(product, quantity, selectedSize!, selectedColor!);
      setToastMessage("Mahsulot savatchaga qo'shildi");
      setToastType("success");
      onOpen();
    } catch (error) {
      setToastMessage("Xatolik yuz berdi");
      setToastType("error");
      onOpen();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const colorNameToHex = (colorName: string): string => {
    return COLOR_MAP[colorName] || colorName;
  };

  const getImageUrl = (imagePath: string): string => {
    return `https://api.sentrobuv.uz/${imagePath}`;
  };

  const handleImageError = () => {
    // fallback logic if needed
  };

  const handleThumbnailError = () => {
    // fallback logic if needed
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <Spinner
            size="lg"
            color="secondary"
            label="Mahsulot yuklanmoqda..."
          />
        </div>
      </DefaultLayout>
    );
  }

  if (error || !product) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className={title({ color: "foreground" })}>Xatolik</h2>
          <p className="text-lg">{error || "Mahsulot topilmadi"}</p>
          <Button as="a" href="/products" color="primary" className="mt-4">
            Mahsulotlar sahifasiga qaytish
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto py-8">
        <Breadcrumbs className="mb-6">
          <BreadcrumbItem href="/">Bosh sahifa</BreadcrumbItem>
          <BreadcrumbItem href="/products">Mahsulotlar</BreadcrumbItem>
          <BreadcrumbItem>{product.name}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden h-96 border border-gray-200">
              <Image
                src={getImageUrl(product.productImages[selectedImage]?.image)}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={handleImageError}
              />
            </div>

            {/* Image Navigation */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {product.productImages.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  tabIndex={0}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer w-24 h-24 
                    ${selectedImage === index ? "border-primary" : "border-gray-200"}`}
                  onClick={() => setSelectedImage(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedImage(index);
                    }
                  }}>
                  <Image
                    src={getImageUrl(img.image)}
                    alt={`${product.name} - rasm ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleThumbnailError}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-4">
            <div>
              <Chip color="primary" variant="flat" className="mb-2">
                {product.brand}
              </Chip>
              <h1 className={title()}>{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">72 ta sharh</span>
              </div>
            </div>

            <div className="my-4">
              <h2 className={title({ size: "sm" })}>
                {parseInt(product.price).toLocaleString("uz-UZ")} so&apos;m
              </h2>
              <p className="text-sm text-gray-500">Barcha soliqlar bilan</p>
            </div>

            <Divider className="my-4" />

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Rang tanlang</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      tabIndex={0}
                      className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center
                        ${selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                      onClick={() => setSelectedColor(color)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedColor(color);
                        }
                      }}
                      style={{ backgroundColor: colorNameToHex(color) }}>
                      {selectedColor === color && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm mt-1">
                  Tanlangan rang:{" "}
                  <span className="font-medium">{selectedColor}</span>
                </p>
              </div>
            )}

            {/* Sizes */}
            {product.size && product.size.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">O&apos;lcham tanlang</h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((size) => (
                    <Chip
                      key={size}
                      variant={selectedSize === size ? "solid" : "bordered"}
                      color={selectedSize === size ? "primary" : "default"}
                      className="cursor-pointer"
                      onClick={() => setSelectedSize(size)}>
                      {size}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Miqdor</h3>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  color="default"
                  variant="flat"
                  size="sm"
                  onClick={() => handleQuantityChange("decrement")}
                  isDisabled={quantity <= 1}>
                  -
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  isIconOnly
                  color="default"
                  variant="flat"
                  size="sm"
                  onClick={() => handleQuantityChange("increment")}>
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-2">
              <Button
                color="primary"
                size="lg"
                className="flex-grow"
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                isDisabled={!selectedSize || !selectedColor}>
                🛒 Savatchaga qo&apos;shish
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="lg"
                aria-label="Sevimlilar">
                ❤️
              </Button>
            </div>

            {/* Product Information */}
            <div className="mt-8">
              <Tabs variant="underlined" aria-label="Mahsulot ma'lumotlari">
                <Tab key="details" title="Mahsulot haqida">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Mahsulot tavsifi</h3>
                    <p className="text-sm text-gray-600">
                      {product.name} - {product.brand} tomonidan ishlab
                      chiqarilgan yuqori sifatli poyabzal. Zamonaviy dizayn va
                      qulay materiallar bilan tayyorlangan.
                    </p>

                    <div className="mt-4">
                      <h4 className="font-medium mb-1">Xususiyatlari:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        <li>Yuqori sifatli materiallar</li>
                        <li>Zamonaviy dizayn</li>
                        <li>Qulay va issiq</li>
                        <li>
                          Uzoq muddat foydalanish uchun mo&apos;ljallangan
                        </li>
                      </ul>
                    </div>
                  </div>
                </Tab>
                <Tab key="shipping" title="Yetkazib berish">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">
                      Yetkazib berish ma&apos;lumotlari
                    </h3>
                    <p className="text-sm text-gray-600">
                      Toshkent shahri bo&apos;ylab 1-3 kun ichida bepul yetkazib
                      beriladi. Viloyatlarga 3-5 kun ichida yetkazib berish
                      mavjud.
                    </p>
                  </div>
                </Tab>
                <Tab key="reviews" title="Sharhlar">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Mijozlar sharhlari</h3>
                    <p className="text-sm text-gray-600">
                      Hozircha sharhlar mavjud emas.
                    </p>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
