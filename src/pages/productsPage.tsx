import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  // Button,
  Spinner,
  Input,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
// import { useCart } from "@/Context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  productImages: Array<{
    id: string;
    image: string;
  }>;
  colors: string[];
  size: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  // const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api.sentrobuv.uz/products");
        if (!response.ok) {
          throw new Error("Mahsulotlarni yuklashda xatolik yuz berdi");
        }
        const data = await response.json();
        setProducts(data.data.products);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand =
      !selectedBrand ||
      product.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSize = !selectedSize || product.size.includes(selectedSize);
    const matchesColor =
      !selectedColor || product.colors.includes(selectedColor);

    return matchesSearch && matchesBrand && matchesSize && matchesColor;
  });

  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const sizes = Array.from(new Set(products.flatMap((p) => p.size)));
  const colors = Array.from(new Set(products.flatMap((p) => p.colors)));

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" color="primary" label="Yuklanmoqda..." />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className={title({ size: "lg" })}>Mahsulotlar</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <Input
            type="text"
            placeholder="Qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded-lg bg-background text-foreground"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Barcha brendlar</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded-lg bg-background text-foreground"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="">Barcha o&apos;lchamlar</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded-lg bg-background text-foreground"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}>
            <option value="">Barcha ranglar</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              isPressable
              as={Link}
              to={`/product/${product.id}`}
              className="h-full">
              <CardBody className="p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={product.name}
                  className="w-full object-cover h-[200px]"
                  src={`https://api.sentrobuv.uz/${product.productImages[0]?.image}`}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <div className="w-full">
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-sm font-medium line-clamp-2">
                    {product.name}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold">
                      {product.price.toLocaleString("uz-UZ")} so&apos;m
                    </p>
                    {/* <Button
                      size="sm"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(
                          product,
                          1,
                          product.size[0],
                          product.colors[0]
                        );
                      }}>
                      Savatchaga
                    </Button> */}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p>Mahsulotlar topilmadi</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
