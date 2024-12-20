import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Product } from "@/types";
import { PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function App() {
  const [theme, setTheme] = useState(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "Classic T-Shirt",
      description:
        "A comfortable and versatile cotton t-shirt for everyday wear.",
      price: 19.99,
      image: "https://picsum.photos/seed/tshirt/300/200",
      category: "Clothing",
    },
    {
      id: 2,
      title: "Classic T-Shirt",
      description:
        "A comfortable and versatile cotton t-shirt for everyday wear.",
      price: 19.99,
      image: "https://picsum.photos/seed/tshirt/300/200",
      category: "Clothing",
    },
    {
      id: 3,
      title: "Classic T-Shirt",
      description:
        "A comfortable and versatile cotton t-shirt for everyday wear.",
      price: 19.99,
      image: "https://picsum.photos/seed/tshirt/300/200",
      category: "Clothing",
    },
    // ... các sản phẩm khác
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState("Tổng quan");

  const [documents] = useState<Document[]>([
    {
      id: "1",
      title: "Kế hoạch huấn luyện năm 2024",
      type: "Kế hoạch",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      status: "published",
      tags: ["Huấn luyện", "Kế hoạch", "2024"],
      description: "Kế hoạch huấn luyện cho năm 2024",
    },
    // Thêm các văn bản mẫu khác...
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 p-4 ml-64 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground dark:text-white">
              {currentPage}
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {currentPage === "Tổng quan" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
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
                      <p className="font-bold mt-2">
                        ${product.price.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button>Add to Cart</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {currentPage === "Văn bản, giấy tờ" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Danh sách văn bản</h2>
                    <p className="text-sm text-muted-foreground">
                      Quản lý tất cả văn bản, giấy tờ trong hệ thống
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm văn bản
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Thêm văn bản mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Nội dung form thêm văn bản */}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Tìm kiếm văn bản..."
                      className="max-w-sm"
                      icon={<Search className="h-4 w-4" />}
                    />
                  </div>
                  {/* Có thể thêm các filter khác ở đây */}
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[100px]">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            {doc.title}
                          </TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(doc.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                doc.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {doc.status === "published"
                                ? "Đã phát hành"
                                : "Nháp"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {currentPage === "Tập trung" && (
              <div>
                <h2 className="text-xl mb-4">Quản lý tập trung</h2>
                {/* Nội dung trang Tập trung */}
              </div>
            )}

            {/* Thêm các điều kiện render cho các trang khác tương tự */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
