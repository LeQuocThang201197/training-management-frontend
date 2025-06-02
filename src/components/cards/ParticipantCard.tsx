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
  Trophy,
  Dumbbell,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  ongoingTraining?: {
    id: number;
    location: string;
    startDate: string;
    endDate: string;
  };
  ongoingCompetition?: {
    id: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
  };
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
  ongoingTraining,
  ongoingCompetition,
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

  const handleViewPersonnel = () => {
    window.open(`/management/personnel/${participant.person.id}`, "_blank");
  };

  return (
    <Card
      className={cn(
        "group relative hover:shadow-md transition-all",
        currentAbsence?.type === "INACTIVE"
          ? "bg-gray-100" // Người không tham gia
          : currentAbsence?.type === "LEAVE"
          ? "bg-yellow-50" // Người đang nghỉ phép
          : ongoingCompetition
          ? "bg-orange-50"
          : ongoingTraining
          ? "bg-blue-50"
          : "bg-green-50"
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
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-700 hover:bg-transparent transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleViewPersonnel}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem chi tiết nhân sự
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowHistory(true)}>
                    <History className="h-4 w-4 mr-2" />
                    Lịch sử vắng mặt
                  </DropdownMenuItem>
                  {onEdit && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          console.log(
                            "Edit button clicked, participant data:",
                            participant
                          );
                          onEdit(participant);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    </>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(participant)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

      {(ongoingTraining || ongoingCompetition) && !currentAbsence && (
        <div className="absolute bottom-2 right-2 z-10">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-sm">
                  {ongoingCompetition ? (
                    <Trophy className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Dumbbell className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-20">
                {ongoingCompetition ? (
                  <>
                    <p className="font-medium">{ongoingCompetition.name}</p>
                    <p className="text-sm">{ongoingCompetition.location}</p>
                  </>
                ) : ongoingTraining ? (
                  <>
                    <p className="font-medium">Đang tập huấn</p>
                    <p className="text-sm">{ongoingTraining.location}</p>
                  </>
                ) : null}
                <p className="text-xs text-gray-500">
                  {new Date(
                    ongoingCompetition?.startDate ||
                      ongoingTraining?.startDate ||
                      ""
                  ).toLocaleDateString("vi-VN")}{" "}
                  -{" "}
                  {new Date(
                    ongoingCompetition?.endDate ||
                      ongoingTraining?.endDate ||
                      ""
                  ).toLocaleDateString("vi-VN")}
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
