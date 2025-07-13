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
import { Search } from "lucide-react";
import { useState } from "react";
import { Competition } from "@/types/competition";

interface AddCompetitionParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  competitionParticipantDetails: Participant[];
  onSubmit: (selectedIds: number[]) => Promise<void>;
  competitionParticipantIds: number[];
  participantNotes: { [key: number]: string };
  onNoteChange: (participantId: number, note: string) => void;
  participantDates: { [key: number]: { startDate: string; endDate: string } };
  onDateChange: (
    participantId: number,
    startDate: string,
    endDate: string
  ) => void;
  competition: Competition;
  onParticipantSelect: (selectedIds: number[]) => void;
}

export function AddCompetitionParticipantDialog({
  isOpen,
  onOpenChange,
  participants,
  competitionParticipantDetails,
  onSubmit,
  competitionParticipantIds,
  participantNotes,
  onNoteChange,
  participantDates,
  onDateChange,
  competition,
  onParticipantSelect,
}: AddCompetitionParticipantDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Kết hợp danh sách người trong đợt tập trung hiện tại và người đã được thêm vào thi đấu
  const allParticipants = [...participants];

  // Thêm những người tham gia thi đấu nhưng không nằm trong đợt tập trung hiện tại
  competitionParticipantDetails.forEach((compParticipant) => {
    if (!participants.find((p) => p.person.id === compParticipant.person.id)) {
      allParticipants.push(compParticipant);
    }
  });

  const filteredParticipants = allParticipants.filter(
    (participant) =>
      participant.person.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participant.role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.organization.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(competitionParticipantIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quản lý người tham gia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm theo tên, vai trò hoặc đơn vị"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={`participant-${participant.id}`}
                  checked={competitionParticipantIds.includes(participant.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onParticipantSelect([
                        ...competitionParticipantIds,
                        participant.id,
                      ]);
                    } else {
                      onParticipantSelect(
                        competitionParticipantIds.filter(
                          (id) => id !== participant.id
                        )
                      );
                    }
                  }}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`participant-${participant.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {participant.person.name}
                  </Label>
                  <div className="text-sm text-gray-500">
                    {participant.role.name} - {participant.organization.name}
                  </div>
                  {!participants.find(
                    (p) => p.person.id === participant.person.id
                  ) && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                      Từ đợt tập trung khác
                    </div>
                  )}
                </div>
                {competitionParticipantIds.includes(participant.id) && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        className="w-32"
                        value={
                          participantDates[participant.id]?.startDate.split(
                            "T"
                          )[0] || competition.startDate.split("T")[0]
                        }
                        onChange={(e) =>
                          onDateChange(
                            participant.id,
                            e.target.value,
                            participantDates[participant.id]?.endDate ||
                              competition.endDate
                          )
                        }
                      />
                      <Input
                        type="date"
                        className="w-32"
                        value={
                          participantDates[participant.id]?.endDate.split(
                            "T"
                          )[0] || competition.endDate.split("T")[0]
                        }
                        onChange={(e) =>
                          onDateChange(
                            participant.id,
                            participantDates[participant.id]?.startDate ||
                              competition.startDate,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <Input
                      placeholder="Ghi chú"
                      value={participantNotes[participant.id] || ""}
                      onChange={(e) =>
                        onNoteChange(participant.id, e.target.value)
                      }
                    />
                  </div>
                )}
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
            <Button type="submit">Cập nhật</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
