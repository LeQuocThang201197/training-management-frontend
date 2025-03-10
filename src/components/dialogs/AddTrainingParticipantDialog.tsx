import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Participant } from "@/types/participant";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AddTrainingParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  onSubmit: (selectedParticipants: number[]) => void;
  existingParticipantIds?: number[];
}

export function AddTrainingParticipantDialog({
  isOpen,
  onOpenChange,
  participants,
  onSubmit,
  existingParticipantIds = [],
}: AddTrainingParticipantDialogProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParticipants = participants.filter(
    (p) =>
      !existingParticipantIds.includes(p.id) &&
      (p.person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.organization.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = () => {
    onSubmit(selectedIds);
    setSelectedIds([]);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm người tham gia tập huấn</DialogTitle>
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
                className="flex items-center space-x-4 p-4 hover:bg-gray-50"
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
                <div>
                  <div className="font-medium">{participant.person.name}</div>
                  <div className="text-sm text-gray-500">
                    {participant.role.name} - {participant.organization.name}
                  </div>
                </div>
              </div>
            ))}
            {filteredParticipants.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedIds([]);
                setSearchTerm("");
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={selectedIds.length === 0}>
              Thêm ({selectedIds.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
