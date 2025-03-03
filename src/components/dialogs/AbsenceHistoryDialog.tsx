import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AbsenceRecord, Participant } from "@/types/participant";
import { LogOut, Clock, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ManageAbsenceDialog } from "./ManageAbsenceDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { API_URL } from "@/config/api";

interface AbsenceHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant;
  absences: AbsenceRecord[];
  onAbsenceChange?: () => void;
}

export function AbsenceHistoryDialog({
  isOpen,
  onOpenChange,
  participant,
  absences,
  onAbsenceChange,
}: AbsenceHistoryDialogProps) {
  const [editingAbsence, setEditingAbsence] = useState<AbsenceRecord | null>(
    null
  );
  const [absenceToDelete, setAbsenceToDelete] = useState<AbsenceRecord | null>(
    null
  );
  const [showManageAbsence, setShowManageAbsence] = useState(false);

  const sortedRecords = [...absences].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const handleDeleteAbsence = async () => {
    try {
      const response = await fetch(
        `${API_URL}/absences/participations/${participant.id}/absences/${
          absenceToDelete!.id
        }`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa thông tin vắng mặt");

      onAbsenceChange?.();
      setAbsenceToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi xóa thông tin vắng mặt");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between items-center pr-4">
              <DialogTitle>
                Lịch sử vắng mặt - {participant.person.name}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManageAbsence(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm vắng mặt
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-3 border rounded-lg group"
                >
                  {record.type === "INACTIVE" ? (
                    <LogOut className="h-5 w-5 text-red-500 mt-1" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500 mt-1" />
                  )}
                  <div className="flex-1">
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
                  <div className="flex gap-2 invisible group-hover:visible">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAbsence(record)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAbsenceToDelete(record)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Chưa có lịch sử vắng mặt
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ManageAbsenceDialog
        isOpen={showManageAbsence}
        onOpenChange={(open) => !open && setShowManageAbsence(false)}
        participant={participant}
        absence={null}
        onSuccess={() => {
          onAbsenceChange?.();
          setShowManageAbsence(false);
        }}
      />

      <ManageAbsenceDialog
        isOpen={!!editingAbsence}
        onOpenChange={(open) => !open && setEditingAbsence(null)}
        participant={participant}
        absence={editingAbsence}
        onSuccess={() => {
          onAbsenceChange?.();
          setEditingAbsence(null);
        }}
      />

      <AlertDialog
        open={!!absenceToDelete}
        onOpenChange={(open) => !open && setAbsenceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Thông tin vắng mặt này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAbsence}>
              Có, xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
