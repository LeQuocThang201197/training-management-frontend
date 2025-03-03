import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Participant, AbsenceRecord } from "@/types/participant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { API_URL } from "@/config/api";

interface ManageAbsenceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant;
  absence?: AbsenceRecord | null;
  onSuccess?: () => void;
}

export function ManageAbsenceDialog({
  isOpen,
  onOpenChange,
  participant,
  absence,
  onSuccess,
}: ManageAbsenceDialogProps) {
  const [type, setType] = useState<"INACTIVE" | "LEAVE">(
    absence?.type || "LEAVE"
  );
  const [startDate, setStartDate] = useState(absence?.startDate || "");
  const [endDate, setEndDate] = useState(absence?.endDate || "");
  const [note, setNote] = useState(absence?.note || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/absences/participations/${participant.id}/absences${
          absence ? `/${absence.id}` : ""
        }`,
        {
          method: absence ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            startDate,
            endDate,
            note,
          }),
        }
      );

      if (!response.ok) throw new Error("Có lỗi xảy ra");

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(`Có lỗi xảy ra khi ${absence ? "cập nhật" : "thêm"} vắng mặt`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Quản lý vắng mặt - {participant.person.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={type}
            onValueChange={(v) => setType(v as "INACTIVE" | "LEAVE")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LEAVE" id="leave" />
              <Label htmlFor="leave">Nghỉ phép</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INACTIVE" id="inactive" />
              <Label htmlFor="inactive">Không tham gia đợt tập trung</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ngày bắt đầu</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Ngày kết thúc</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Ghi chú</Label>
            <Input
              placeholder="Lý do vắng mặt..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
