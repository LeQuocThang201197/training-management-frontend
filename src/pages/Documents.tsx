import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
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
import { Document } from "@/types";

export function DocumentsPage() {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground dark:text-white">
            Danh sách văn bản
          </h2>
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
            <div className="grid gap-4 py-4">{/* Form thêm văn bản */}</div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm văn bản..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground dark:text-white">
                Tiêu đề
              </TableHead>
              <TableHead className="text-foreground dark:text-white">
                Loại
              </TableHead>
              <TableHead className="text-foreground dark:text-white">
                Tags
              </TableHead>
              <TableHead className="text-foreground dark:text-white">
                Ngày tạo
              </TableHead>
              <TableHead className="text-foreground dark:text-white">
                Trạng thái
              </TableHead>
              <TableHead className="w-[100px] text-foreground dark:text-white">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium text-foreground dark:text-white">
                  {doc.title}
                </TableCell>
                <TableCell className="text-foreground dark:text-white">
                  {doc.type}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-foreground dark:text-white">
                  {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      doc.status === "published" ? "default" : "secondary"
                    }
                  >
                    {doc.status === "published" ? "Đã phát hành" : "Nháp"}
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
  );
}
