import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AbsenceRecord } from "@/types/participant";
import { AlertCircle, Clock } from "lucide-react";

interface AbsenceHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  absenceRecords?: AbsenceRecord[];
}

export function AbsenceHistoryDialog({
  isOpen,
  onOpenChange,
  absenceRecords = [],
}: AbsenceHistoryDialogProps) {
  const sortedRecords = [...absenceRecords].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lịch sử vắng mặt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {sortedRecords.map((record) => (
            <div
              key={record.id}
              className="flex items-start gap-3 p-3 border rounded-lg"
            >
              {record.type === "INACTIVE" ? (
                <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-500 mt-1" />
              )}
              <div>
                <div className="font-medium">
                  {record.type === "INACTIVE"
                    ? "Không tham gia đợt tập trung"
                    : "Nghỉ phép"}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(record.startDate).toLocaleDateString("vi-VN")}
                  {record.endDate &&
                    ` - ${new Date(record.endDate).toLocaleDateString(
                      "vi-VN"
                    )}`}
                </div>
                {record.note && (
                  <div className="text-sm text-gray-600 mt-1">
                    {record.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
