import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Participant } from "@/types/participant";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddTrainingParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  onSubmit: (selectedParticipationIds: number[]) => void;
  trainingParticipantIds?: number[];
}

export function AddTrainingParticipantDialog({
  isOpen,
  onOpenChange,
  participants,
  onSubmit,
  trainingParticipantIds = [],
}: AddTrainingParticipantDialogProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    trainingParticipantIds
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedIds(trainingParticipantIds);
  }, [trainingParticipantIds]);

  const filteredParticipants = participants.filter(
    (p) =>
      p.person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    onSubmit(selectedIds);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quản lý người tham gia tập huấn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm theo tên, chức vụ hoặc đơn vị..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  "flex items-center space-x-4 p-4 hover:bg-gray-50",
                  trainingParticipantIds.includes(participant.id) &&
                    "bg-blue-50/50"
                )}
              >
                <Checkbox
                  checked={selectedIds.includes(participant.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds([...selectedIds, participant.id]);
                    } else {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== participant.id)
                      );
                    }
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium">{participant.person.name}</div>
                  <div className="text-sm text-gray-500">
                    {participant.role.name} - {participant.organization.name}
                  </div>
                </div>
                {trainingParticipantIds.includes(participant.id) && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Đang tham gia
                  </span>
                )}
              </div>
            ))}
            {filteredParticipants.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Đã chọn {selectedIds.length} người
              {selectedIds.length !== trainingParticipantIds.length && (
                <span className="ml-1">
                  (
                  {selectedIds.length - trainingParticipantIds.length > 0
                    ? "+"
                    : ""}
                  {selectedIds.length - trainingParticipantIds.length})
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setSelectedIds(trainingParticipantIds);
                  setSearchTerm("");
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedIds.length === 0}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
