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
import { Competition } from "@/types/competition";

interface CompetitionFormData {
  name: string;
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  note?: string;
  is_confirmed: boolean;
  concentration_id: string;
}

interface CompetitionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CompetitionFormData) => Promise<void>;
  competition?: Competition | null;
  concentrationId: string;
}

export function CompetitionDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  competition,
  concentrationId,
}: CompetitionDialogProps) {
  const [formData, setFormData] = useState<CompetitionFormData>({
    name: "",
    location: "",
    isForeign: false,
    startDate: "",
    endDate: "",
    note: "",
    is_confirmed: false,
    concentration_id: concentrationId,
  });

  useEffect(() => {
    if (competition) {
      setFormData({
        name: competition.name,
        location: competition.location,
        isForeign: competition.isForeign,
        startDate: competition.startDate.split("T")[0],
        endDate: competition.endDate.split("T")[0],
        note: competition.note || "",
        is_confirmed: competition.is_confirmed,
        concentration_id: concentrationId,
      });
    }
  }, [competition, concentrationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {competition ? "Chỉnh sửa thi đấu" : "Thêm thi đấu"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên giải đấu</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

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
            <Label htmlFor="isForeign">Thi đấu ở nước ngoài</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
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
              <Label htmlFor="endDate">Ngày kết thúc</Label>
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
            />
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

          <div className="flex justify-end gap-4">
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
