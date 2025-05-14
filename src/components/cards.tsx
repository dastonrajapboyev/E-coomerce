import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  // Button,
  Spinner,
} from "@heroui/react";
import { Link } from "react-router-dom";
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

interface CardsProps {
  limit?: number;
}

export default function Cards({ limit }: CardsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api.sentrobuv.uz/products");
        if (!response.ok) {
          throw new Error("Mahsulotlarni yuklashda xatolik yuz berdi");
        }
        const data = await response.json();

        setProducts(
          limit ? data.data.products.slice(0, limit) : data.data.products
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" color="primary" label="Yuklanmoqda..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-0">
      {products.map((product) => (
        <Card
          key={product.id}
          isPressable
          as={Link}
          to={`/product/${product.id}`}
          className="h-full w-full !max-w-full">
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
              <p className="text-sm font-medium line-clamp-2">{product.name}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-lg font-bold">
                  {product.price.toLocaleString("uz-UZ")} so&apos;m
                </p>
                {/* <Button
                  size="sm"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, 1, product.size[0], product.colors[0]);
                  }}>
                  Savatchaga
                </Button> */}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
