import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Participant } from "@/types/participant";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddCompetitionParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  onSubmit: (selectedIds: number[]) => Promise<void>;
  competitionParticipantIds: number[];
  participantNotes: { [key: number]: string };
  onNoteChange: (participantId: number, note: string) => void;
}

export function AddCompetitionParticipantDialog({
  isOpen,
  onOpenChange,
  participants,
  onSubmit,
  competitionParticipantIds,
  participantNotes,
  onNoteChange,
}: AddCompetitionParticipantDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(competitionParticipantIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý người tham gia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-start gap-4 p-3 border rounded-lg"
              >
                <Checkbox
                  id={`participant-${participant.id}`}
                  checked={competitionParticipantIds.includes(participant.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSubmit([...competitionParticipantIds, participant.id]);
                    } else {
                      onSubmit(
                        competitionParticipantIds.filter(
                          (id) => id !== participant.id
                        )
                      );
                    }
                  }}
                />
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`participant-${participant.id}`}>
                    <div>{participant.person.name}</div>
                    <div className="text-sm text-gray-500">
                      {participant.role.name} - {participant.organization.name}
                    </div>
                  </Label>
                  {competitionParticipantIds.includes(participant.id) && (
                    <Input
                      placeholder="Ghi chú (không bắt buộc)"
                      value={participantNotes[participant.id] || ""}
                      onChange={(e) =>
                        onNoteChange(participant.id, e.target.value)
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
