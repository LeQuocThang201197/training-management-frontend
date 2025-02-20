import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_URL } from "@/config/api";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface Document {
  id: number;
  number: number;
  code: string;
  publisher: string;
  type: string;
  content: string;
  related_year: number;
  date: string;
  file_name: string;
  file_path: string;
  createdAt: string;
  updatedAt: string;
}

type SortOption = {
  field: "title" | "createdAt";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "title", direction: "asc", label: "Tiêu đề (A-Z)" },
  { field: "title", direction: "desc", label: "Tiêu đề (Z-A)" },
  { field: "createdAt", direction: "desc", label: "Mới nhất" },
  { field: "createdAt", direction: "asc", label: "Cũ nhất" },
];

interface DocumentFormData {
  number: number;
  code: string;
  publisher: string;
  type: string;
  content: string;
  related_year: number;
  date: string;
  file: File | null;
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_URL}/papers`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách văn bản");

        const data = await response.json();
        if (data.success) {
          setDocuments(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<DocumentFormData>({
    number: 0,
    code: "",
    publisher: "",
    type: "",
    content: "",
    related_year: new Date().getFullYear(),
    date: new Date().toISOString().split("T")[0],
    file: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formDataToSend.append(key, value);
      });

      const response = await fetch(`${API_URL}/papers`, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Không thể tạo văn bản");

      const data = await response.json();
      if (data.success) {
        setDocuments((prev) => [...prev, data.data]);
        setIsDialogOpen(false);
        setFormData({
          number: 0,
          code: "",
          date: "",
          type: "",
          related_year: new Date().getFullYear(),
          publisher: "",
          content: "",
          file: null,
        });
      }
    } catch (err) {
      console.error("Create document error:", err);
    }
  };

  const handleViewFile = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}/file`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải file");

      // Lấy blob từ response
      const blob = await response.blob();
      // Tạo URL tạm thời để mở file
      const url = window.URL.createObjectURL(blob);
      // Mở file trong tab mới
      window.open(url, "_blank");
      // Giải phóng URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("View file error:", err);
      alert("Không thể mở file");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px] text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Quản lý Văn bản</h1>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      {currentSort.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={`${option.field}-${option.direction}`}
                        onClick={() => setCurrentSort(option)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Thêm văn bản
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Thêm văn bản mới</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex gap-4">
                        <div className="space-y-2 w-24">
                          <Label htmlFor="number">Số</Label>
                          <Input
                            id="number"
                            type="number"
                            value={formData.number}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                number: parseInt(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2 flex-1">
                          <Label htmlFor="code">Ký hiệu</Label>
                          <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                code: e.target.value,
                              }))
                            }
                            placeholder="VD: QĐ-TCTDTT"
                            required
                          />
                        </div>

                        <div className="space-y-2 w-40">
                          <Label htmlFor="date">Ngày ban hành</Label>
                          <DatePicker
                            value={
                              formData.date ? new Date(formData.date) : null
                            }
                            onChange={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                date: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              }))
                            }
                            placeholder="Chọn ngày"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="space-y-2 flex-1">
                          <Label htmlFor="type">Loại văn bản</Label>
                          <select
                            id="type"
                            className="w-full p-2 border rounded-md"
                            value={formData.type}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            required
                          >
                            <option value="">Chọn loại văn bản</option>
                            <option value="Quyết định">Quyết định</option>
                            <option value="Công văn">Công văn</option>
                            <option value="Tờ trình">Tờ trình</option>
                            <option value="Thông báo">Thông báo</option>
                            <option value="Kế hoạch">Kế hoạch</option>
                            <option value="Báo cáo">Báo cáo</option>
                          </select>
                        </div>

                        <div className="space-y-2 w-40">
                          <Label htmlFor="related_year">Năm liên quan</Label>
                          <Input
                            id="related_year"
                            type="number"
                            value={formData.related_year}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                related_year: parseInt(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2 flex-1">
                          <Label htmlFor="publisher">Đơn vị ban hành</Label>
                          <Input
                            id="publisher"
                            value={formData.publisher}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                publisher: e.target.value,
                              }))
                            }
                            placeholder="VD: Cục thể dục thể thao"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Trích yếu nội dung</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          placeholder="VD: V/v tập huấn đội tuyển Điền kinh quốc gia tại Trung tâm  
Huấn luyện Thể thao quốc gia thành phố Hồ Chí Minh năm 2025"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file">Tệp đính kèm</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              file: e.target.files?.[0] || null,
                            }))
                          }
                          accept=".pdf,.doc,.docx"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">Thêm mới</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm văn bản..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-64">
                <select className="w-full p-2 border rounded-md">
                  <option value="">Tất cả loại</option>
                  <option value="plan">Kế hoạch</option>
                  <option value="report">Báo cáo</option>
                  <option value="decision">Quyết định</option>
                </select>
              </div>
              <div className="w-64">
                <select className="w-full p-2 border rounded-md">
                  <option value="">Tất cả trạng thái</option>
                  <option value="published">Đã phát hành</option>
                  <option value="draft">Nháp</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Ngày ban hành</TableHead>
                    <TableHead>Đơn vị ban hành</TableHead>
                    <TableHead className="w-[100px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.number} /{doc.code}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.content}</TableCell>
                      <TableCell>
                        {new Date(doc.date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{doc.publisher}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewFile(doc.id)}
                          >
                            Xem
                          </Button>
                          <Button variant="ghost" size="sm">
                            Chi tiết
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
