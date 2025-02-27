import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User, Mars, Venus, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Participant } from "@/types/participant";

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
  return (
    <Card>
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
              <div className="flex gap-2">
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
    </Card>
  );
}
