import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, User, Mars, Venus } from "lucide-react";

interface Person {
  id: number;
  name: string;
  gender: string;
  code: string;
}

interface Role {
  id: number;
  name: string;
  type: string;
  typeLabel: string;
}

interface Organization {
  id: number;
  name: string;
}

interface Participant {
  id: number;
  person: Person;
  role: Role;
  organization: Organization;
  startDate: string;
  endDate: string;
  note: string;
}

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
            <p className="font-medium">{participant.person.name}</p>
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
            <p>
              {new Date(participant.startDate).toLocaleDateString("vi-VN")} -{" "}
              {new Date(participant.endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
