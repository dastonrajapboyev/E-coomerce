import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import {
  Image,
  Chip,
  Button,
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { title } from "@/components/primitives";
import { useCart } from "@/Context/CartContext";

interface ProductImage {
  id: number;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  colors: string[];
  size: string[];
  productImages: ProductImage[];
  description?: string;
}

interface ColorMap {
  [key: string]: string;
}

const colorMap: ColorMap = {
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { onOpen } = useDisclosure();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://api.sentrobuv.uz/products/${id}`);
        if (!response.ok) {
          throw new Error(
            "Mahsulot ma'lumotlarini yuklashda xatolik yuz berdi"
          );
        }
        const data = await response.json();
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.size && data.size.length > 0) {
          setSelectedSize(data.size[0]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (action: "increment" | "decrement") => {
    setQuantity((prev) => {
      if (action === "increment") {
        return prev + 1;
      }
      return Math.max(1, prev - 1);
    });
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedColor) {
      alert("Iltimos, rangni tanlang");
      return;
    }

    if (!selectedSize) {
      alert("Iltimos, o'lchamni tanlang");
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    onOpen();
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" color="primary" label="Yuklanmoqda..." />
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
          <Button
            color="primary"
            className="mt-4"
            onClick={() => navigate("/products")}>
            Mahsulotlarga qaytish
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs className="mb-4">
          <BreadcrumbItem href="/">Bosh sahifa</BreadcrumbItem>
          <BreadcrumbItem href="/products">Mahsulotlar</BreadcrumbItem>
          <BreadcrumbItem>{product.name}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src={`https://api.sentrobuv.uz/${product.productImages[0]?.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.productImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={`https://api.sentrobuv.uz/${img.image}`}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className={title({ size: "lg" })}>{product.name}</h1>
              <p className="text-lg text-gray-500 mt-2">{product.brand}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {product.price.toLocaleString("uz-UZ")} so&apos;m
              </h2>
            </div>

            <Divider />

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-2">Ranglar</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Chip
                    key={color}
                    variant={selectedColor === color ? "solid" : "flat"}
                    color={selectedColor === color ? "primary" : "default"}
                    onClick={() => handleColorSelect(color)}
                    style={{
                      backgroundColor: colorMap[color] || color,
                      color: color === "white" ? "black" : "white",
                    }}>
                    {color}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-2">O&apos;lchamlar</h3>
              <div className="flex flex-wrap gap-2">
                {product.size.map((size) => (
                  <Chip
                    key={size}
                    variant={selectedSize === size ? "solid" : "flat"}
                    color={selectedSize === size ? "primary" : "default"}
                    onClick={() => handleSizeSelect(size)}>
                    {size}
                  </Chip>
                ))}
              </div>
            </div>

            <Divider />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  isIconOnly
                  variant="flat"
                  onClick={() => handleQuantityChange("decrement")}>
                  -
                </Button>
                <span className="text-lg">{quantity}</span>
                <Button
                  isIconOnly
                  variant="flat"
                  onClick={() => handleQuantityChange("increment")}>
                  +
                </Button>
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}>
                Savatchaga qo&apos;shish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
