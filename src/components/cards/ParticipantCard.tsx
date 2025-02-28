import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  User,
  Mars,
  Venus,
  FileText,
  AlertCircle,
  Clock,
  History,
  UserMinus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Participant, AbsenceRecord } from "@/types/participant";
import { useState } from "react";
import { AbsenceHistoryDialog } from "../dialogs/AbsenceHistoryDialog";
import { ManageAbsenceDialog } from "../dialogs/ManageAbsenceDialog";

interface ParticipantCardProps {
  participant: Participant;
  onEdit?: (participant: Participant) => void;
  onDelete?: (participant: Participant) => void;
}

const GenderIcon = ({ gender }: { gender: string }) => {
  if (gender === "Nam") return <Mars className="h-6 w-6 text-blue-400" />;
  if (gender === "Nữ") return <Venus className="h-6 w-6 text-pink-400" />;
  return <User className="h-6 w-6 text-gray-400" />;
};

const getBirthYear = (birthday: string | null) => {
  if (!birthday) return "N/A";
  const year = new Date(birthday).getFullYear();
  return isNaN(year) ? "N/A" : year;
};

export function ParticipantCard({
  participant,
  onEdit,
  onDelete,
}: ParticipantCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showManageAbsence, setShowManageAbsence] = useState(false);

  const getAbsenceStatus = (absence?: AbsenceRecord) => {
    if (!absence) return null;

    switch (absence.type) {
      case "REMOVED":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          text: "Đã rời khỏi đợt tập trung",
          date: `từ ${new Date(absence.startDate).toLocaleDateString("vi-VN")}`,
        };
      case "MISSION":
        return {
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          text: "Đang tham gia đợt tập huấn/thi đấu khác",
          date: `từ ${new Date(absence.startDate).toLocaleDateString("vi-VN")}`,
        };
      case "LEAVE":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          text: "Đang nghỉ phép",
          date: `${new Date(absence.startDate).toLocaleDateString(
            "vi-VN"
          )} - ${new Date(absence.endDate!).toLocaleDateString("vi-VN")}`,
        };
    }
  };

  const absenceStatus = getAbsenceStatus(participant.currentAbsence);

  return (
    <Card className="group">
      <CardContent className="flex items-center p-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 mr-4 flex items-center justify-center">
          <GenderIcon gender={participant.person.gender} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <p className="font-medium">{participant.person.name}</p>
              {participant.note && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FileText className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs break-words">{participant.note}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {(onEdit || onDelete) && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowManageAbsence(true)}
                  className="text-gray-600"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(participant)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(participant)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{participant.role.name}</p>
            <p>{participant.organization.name}</p>
            <p>{getBirthYear(participant.person.birthday)}</p>
          </div>
          {participant.isCurrentlyAbsent && absenceStatus && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    {absenceStatus.icon}
                    <div className="text-sm">
                      <p className="font-medium">{absenceStatus.text}</p>
                      <p className="text-gray-500">{absenceStatus.date}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nhấn để xem lịch sử vắng mặt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {(participant.absenceRecords || []).length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              className="text-gray-600"
            >
              <History className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>

      <AbsenceHistoryDialog
        isOpen={showHistory}
        onOpenChange={setShowHistory}
        absenceRecords={participant.absenceRecords || []}
      />

      <ManageAbsenceDialog
        isOpen={showManageAbsence}
        onOpenChange={setShowManageAbsence}
        participant={participant}
      />
    </Card>
  );
}
