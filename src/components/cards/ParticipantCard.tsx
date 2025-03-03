import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  User,
  Mars,
  Venus,
  FileText,
  LogOut,
  Clock,
  History,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Participant, AbsenceRecord } from "@/types/participant";
import { useState, useCallback } from "react";
import { AbsenceHistoryDialog } from "../dialogs/AbsenceHistoryDialog";
import { cn } from "@/lib/utils";

interface ParticipantCardProps {
  participant: Participant;
  onEdit?: (participant: Participant) => void;
  onDelete?: (participant: Participant) => void;
  onAbsenceChange?: () => void;
  absences: AbsenceRecord[];
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
  onAbsenceChange,
  absences,
}: ParticipantCardProps) {
  const [showHistory, setShowHistory] = useState(false);

  const getCurrentAbsence = useCallback(() => {
    const now = new Date().setHours(0, 0, 0, 0); // Set thời gian hiện tại về đầu ngày

    return absences.find((absence) => {
      const startDate = new Date(absence.startDate).getTime();
      const endDate = new Date(absence.endDate).getTime();

      return startDate <= now && endDate >= now;
    });
  }, [absences]);

  const currentAbsence = getCurrentAbsence();

  return (
    <Card
      className={cn(
        "group relative hover:shadow-md transition-all",
        currentAbsence?.type === "INACTIVE"
          ? "bg-gray-100" // Người không tham gia
          : currentAbsence?.type === "LEAVE"
          ? "bg-yellow-50" // Người đang nghỉ phép
          : "bg-green-50" // Người đang tham gia
      )}
    >
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
                  onClick={() => setShowHistory(true)}
                  className="text-gray-600"
                >
                  <History className="h-4 w-4" />
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
        </div>
      </CardContent>

      {currentAbsence && (
        <div className="absolute bottom-2 right-2 z-10">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-sm">
                  {currentAbsence.type === "INACTIVE" ? (
                    <LogOut className="h-4 w-4 text-red-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-20">
                <p>
                  {currentAbsence.type === "INACTIVE"
                    ? "Không tham gia đợt tập trung"
                    : "Đang nghỉ phép"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(currentAbsence.startDate).toLocaleDateString(
                    "vi-VN"
                  )}
                  {currentAbsence.endDate &&
                    ` - ${new Date(currentAbsence.endDate).toLocaleDateString(
                      "vi-VN"
                    )}`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <AbsenceHistoryDialog
        isOpen={showHistory}
        onOpenChange={setShowHistory}
        participant={participant}
        absences={absences}
        onAbsenceChange={onAbsenceChange}
      />
    </Card>
  );
}
