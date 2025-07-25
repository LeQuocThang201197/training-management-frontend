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
  onSuccess: (document?: Document) => void;
  infoMessage?: string;
}

// Thêm hàm khởi tạo formData
const getInitialFormData = (doc?: Document | null) => ({
  number: doc?.number || null,
  code: doc?.code || null,
  publisher: doc?.publisher || "",
  type: doc?.type || "",
  content: doc?.content || "",
  related_year: doc?.related_year || new Date().getFullYear(),
  date: doc?.date?.split("T")[0] || new Date().toISOString().split("T")[0],
  file: null as File | null,
});

export function DocumentFormDialog({
  document,
  open,
  onOpenChange,
  onSuccess,
  infoMessage,
}: Props) {
  const [formData, setFormData] = useState(getInitialFormData(document));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(document));
    }
  }, [open, document]);

  const validateForm = (data: typeof formData) => {
    if (!data.type) return "Vui lòng chọn loại văn bản";
    if (!data.publisher) return "Vui lòng nhập đơn vị ban hành";
    if (!data.content) return "Vui lòng nhập nội dung";
    if (!data.related_year) return "Vui lòng nhập năm liên quan";
    if (!document && !data.file) return "Vui lòng chọn file đính kèm";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm(formData);
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    try {
      // Nếu là thêm mới (có file) thì dùng FormData
      if (!document) {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            if (key === "file" && value instanceof File) {
              formDataToSend.append("file", value);
            } else if (key !== "file") {
              formDataToSend.append(key, String(value));
            }
          }
        });

        const response = await fetch(`${API_URL}/papers`, {
          method: "POST",
          credentials: "include",
          body: formDataToSend,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Lưu văn bản thất bại");
        }
        onSuccess(data.data); // Trả về document vừa tạo
        onOpenChange(false);
        return;
      }
      // Nếu là cập nhật (không có file) thì dùng JSON
      else {
        // Lấy tất cả trường trừ file
        const dataToSend = {
          number: formData.number,
          code: formData.code,
          publisher: formData.publisher,
          type: formData.type,
          content: formData.content,
          related_year: formData.related_year,
          date: formData.date,
        };
        const response = await fetch(`${API_URL}/papers/${document.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Lưu văn bản thất bại");
        }
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save document:", error);
      alert(error instanceof Error ? error.message : "Lưu văn bản thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {document ? "Chỉnh sửa thông tin văn bản" : "Thêm văn bản mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {infoMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-2 text-blue-700 text-sm">
              {infoMessage}
            </div>
          )}
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
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value === "" ? null : e.target.value,
                  }))
                }
                placeholder="VD: QĐ-TDTTVN"
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

          {!document && (
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
              <p className="text-sm text-muted-foreground">
                Chọn file để tải lên (.pdf, .doc, .docx)
              </p>
            </div>
          )}

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
