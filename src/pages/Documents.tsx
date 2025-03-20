import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  ArrowUpDown,
  Edit,
  Eye,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { useNavigate } from "react-router-dom";
import { DocumentFormDialog } from "@/components/dialogs/DocumentFormDialog";

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

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [formDialogOpen, setFormDialogOpen] = useState(false);

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

                <Button onClick={() => setFormDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm tài liệu
                </Button>
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
                      <TableCell>
                        {[doc.number, doc.code]
                          .filter((val) => val !== null && val !== "")
                          .join(" / ")}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.content}</TableCell>
                      <TableCell>
                        {new Date(doc.date).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{doc.publisher}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleViewFile(doc.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/management/papers/${doc.id}`)
                                }
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setFormDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <DocumentFormDialog
        document={selectedDocument}
        open={formDialogOpen}
        onOpenChange={(open) => {
          setFormDialogOpen(open);
          if (!open) setSelectedDocument(null);
        }}
        onSuccess={() => {
          const fetchDocuments = async () => {
            try {
              const response = await fetch(`${API_URL}/papers`, {
                credentials: "include",
              });
              if (!response.ok)
                throw new Error("Không thể tải danh sách văn bản");

              const data = await response.json();
              if (data.success) {
                setDocuments(data.data);
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
            }
          };
          fetchDocuments();
        }}
      />
    </div>
  );
}
