import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Competition, CompetitionFormData } from "@/types/competition";

interface CompetitionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CompetitionFormData) => Promise<void>;
  competition?: Competition | null;
}

export function CompetitionDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  competition,
}: CompetitionDialogProps) {
  const [formData, setFormData] = useState<CompetitionFormData>({
    name: "",
    location: "",
    isForeign: false,
    startDate: "",
    endDate: "",
    note: "",
    is_confirmed: false,
    concentration_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (competition) {
        setFormData({
          name: competition.name,
          location: competition.location,
          isForeign: competition.isForeign,
          startDate: competition.startDate.split("T")[0],
          endDate: competition.endDate.split("T")[0],
          note: competition.note || "",
          is_confirmed: competition.is_confirmed,
          concentration_id: "", // Sẽ cần API để lấy concentration_id
        });
      } else {
        setFormData({
          name: "",
          location: "",
          isForeign: false,
          startDate: "",
          endDate: "",
          note: "",
          is_confirmed: false,
          concentration_id: "",
        });
      }
    }
  }, [isOpen, competition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {competition ? "Chỉnh sửa thi đấu" : "Thêm thi đấu"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên giải đấu *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập tên giải đấu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Địa điểm *</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Nhập địa điểm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <Input
                id="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc *</Label>
              <Input
                id="endDate"
                type="date"
                required
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              placeholder="Nhập ghi chú (nếu có)"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isForeign"
                checked={formData.isForeign}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isForeign: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="isForeign">Thi đấu quốc tế</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_confirmed"
                checked={formData.is_confirmed}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_confirmed: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="is_confirmed">Đã xác nhận</Label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {competition ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
