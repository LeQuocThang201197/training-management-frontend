import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
}

interface Props {
  document?: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DocumentFormDialog({
  document,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    number: document?.number || null,
    code: document?.code || null,
    publisher: document?.publisher || "",
    type: document?.type || "",
    content: document?.content || "",
    related_year: document?.related_year || new Date().getFullYear(),
    date: document?.date || new Date().toISOString().split("T")[0],
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  useEffect(() => {
    if (open && document) {
      setFormData({
        number: document.number,
        code: document.code,
        publisher: document.publisher,
        type: document.type,
        content: document.content,
        related_year: document.related_year,
        date: new Date(document.date).toISOString().split("T")[0],
        file: null,
      });
    } else if (!open) {
      // Reset form when closing
      setFormData({
        number: null,
        code: null,
        publisher: "",
        type: "",
        content: "",
        related_year: new Date().getFullYear(),
        date: new Date().toISOString().split("T")[0],
        file: null,
      });
    }
  }, [open, document]);

  useEffect(() => {
    if (document?.file_name) {
      setCurrentFileName(document.file_name);
    } else {
      setCurrentFileName("");
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (key === "file") {
          // Only append file if a new one is selected
          if (value instanceof File) {
            formDataToSend.append("file", value);
          }
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    try {
      const response = await fetch(
        `${API_URL}/papers${document ? `/${document.id}` : ""}`,
        {
          method: document ? "PUT" : "POST",
          credentials: "include",
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Lưu văn bản thất bại");

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Lưu văn bản thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {document ? "Chỉnh sửa văn bản" : "Thêm văn bản mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2 w-24">
              <Label htmlFor="number">Số</Label>
              <Input
                id="number"
                type="number"
                value={formData.number === null ? "" : formData.number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    number:
                      e.target.value === "" ? null : parseInt(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label htmlFor="code">Ký hiệu</Label>
              <Input
                id="code"
                value={formData.code === null ? "" : formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value || null,
                  }))
                }
                placeholder="VD: QĐ-TCTDTT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Ngày ban hành</Label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              placeholder="VD: V/v tập huấn đội tuyển Điền kinh quốc gia tại Trung tâm Huấn luyện Thể thao quốc gia thành phố Hồ Chí Minh năm 2025"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Tệp đính kèm</Label>
            {currentFileName && (
              <div className="text-sm text-muted-foreground mb-2">
                File hiện tại: {currentFileName}
              </div>
            )}
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
              required={!document}
            />
            <p className="text-sm text-muted-foreground">
              {document
                ? "Tải lên file mới nếu muốn thay thế file hiện tại"
                : "Chọn file để tải lên (.pdf, .doc, .docx)"}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : document ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
