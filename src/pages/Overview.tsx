import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export function OverviewPage() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      title: "Classic T-Shirt",
      description:
        "A comfortable and versatile cotton t-shirt for everyday wear.",
      price: 19.99,
      image: "https://picsum.photos/seed/tshirt/300/200",
      category: "Clothing",
    },
    // ... thêm sản phẩm khác
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>{product.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover mb-2"
            />
            <p>{product.description}</p>
            <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button>Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
