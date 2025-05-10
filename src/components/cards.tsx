import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  size: string[];
  productImages: Array<{
    image: string;
  }>;
}

interface CardComponentProps {
  limit?: number;
}

export default function CardComponent({ limit }: CardComponentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://api.sentrobuv.uz/products")
      .then((res) => res.json())
      .then((data) => {
        const productList = data.data.products || [];
        // Agar limit berilgan bo'lsa, shu limitgacha chiqarish
        const limitedProducts = limit
          ? productList.slice(0, limit)
          : productList;
        setProducts(limitedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Mahsulotlarni yuklashda xatolik yuz berdi");
        setLoading(false);
      });
  }, [limit]);

  if (loading) {
    return <div className="w-full text-center py-8">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="w-full text-center py-8">Mahsulotlar topilmadi</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="no-underline">
          <Card className="py-4 cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardBody className="overflow-visible py-2">
              <Image
                alt={product.name}
                className="object-cover rounded-xl w-full h-72"
                src={`https://api.sentrobuv.uz/${product.productImages[0]?.image}`}
                width={0}
                height={0}
              />
            </CardBody>

            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">{product.brand}</p>
              <small className="text-default-500">
                Sizes: {product.size.join(", ")}
              </small>
              <h4 className="font-bold text-large">{product.name}</h4>
              <p className="text-default-500 mt-1">
                Narxi: {parseInt(product.price).toLocaleString("uz-UZ")}{" "}
                so&apos;m
              </p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
