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

interface TrainingFormData {
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  concentration_id: string;
  note?: string;
}

interface TrainingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TrainingFormData;
  setFormData: (data: TrainingFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: "add" | "edit";
}

export function TrainingDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  mode,
}: TrainingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Thêm đợt tập huấn mới"
              : "Chỉnh sửa đợt tập huấn"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Địa điểm <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isForeign"
              checked={formData.isForeign}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  isForeign: checked as boolean,
                })
              }
            />
            <Label htmlFor="isForeign">Tập huấn nước ngoài</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  note: e.target.value,
                })
              }
              placeholder="Nhập ghi chú nếu có..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {mode === "add" ? "Thêm" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
