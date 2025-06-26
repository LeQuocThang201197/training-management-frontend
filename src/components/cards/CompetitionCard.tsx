import { Competition } from "@/types/competition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Edit,
  Trash2,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { PermissionGate } from "@/components/PermissionGate";
import { Link } from "react-router-dom";

interface CompetitionCardProps {
  competition: Competition;
  onEdit?: (competition: Competition) => void;
  onDelete?: (competition: Competition) => void;
}

export function CompetitionCard({
  competition,
  onEdit,
  onDelete,
}: CompetitionCardProps) {
  const today = new Date();
  const startDate = new Date(competition.startDate);
  const endDate = new Date(competition.endDate);
  endDate.setHours(23, 59, 59, 999);

  const getStatus = () => {
    if (today < startDate) {
      return { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-800" };
    } else if (today > endDate) {
      return { label: "Đã kết thúc", color: "bg-gray-100 text-gray-800" };
    } else {
      return { label: "Đang diễn ra", color: "bg-green-100 text-green-800" };
    }
  };

  const status = getStatus();
  const totalParticipants = competition.totalParticipants;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {competition.name}
          </CardTitle>
          <div className="flex gap-1">
            <PermissionGate permission="UPDATE_COMPETITION">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit?.(competition)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="DELETE_COMPETITION">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700"
                onClick={() => onDelete?.(competition)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={status.color}>{status.label}</Badge>
          {competition.is_confirmed && (
            <Badge variant="secondary">Đã xác nhận</Badge>
          )}
          {competition.isForeign && <Badge variant="outline">Quốc tế</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{competition.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(startDate, "dd/MM/yyyy", { locale: vi })} -{" "}
              {format(endDate, "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>

          {/* Thông tin đợt tập trung */}
          {competition.concentrations &&
            competition.concentrations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Đội tham gia:</span>
                </div>
                <div className="space-y-1">
                  {competition.concentrations.map(
                    (concentrationItem, index) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-50 p-2 rounded"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">
                              {concentrationItem.concentration.team.sport.name}
                            </div>
                            <div className="text-gray-500">
                              {concentrationItem.concentration.team.type} -{" "}
                              {concentrationItem.concentration.team.gender}
                            </div>
                            <div className="text-gray-500">
                              {concentrationItem.concentration.location} •{" "}
                              {format(
                                new Date(
                                  concentrationItem.concentration.startDate
                                ),
                                "dd/MM/yyyy",
                                { locale: vi }
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(
                                  concentrationItem.concentration.endDate
                                ),
                                "dd/MM/yyyy",
                                { locale: vi }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{totalParticipants} người tham gia</span>
          </div>

          {totalParticipants > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>VĐV:</span>
                <span className="font-medium">
                  {competition.participantStats.ATHLETE}
                </span>
              </div>
              <div className="flex justify-between">
                <span>HLV:</span>
                <span className="font-medium">
                  {competition.participantStats.COACH}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Chuyên gia:</span>
                <span className="font-medium">
                  {competition.participantStats.SPECIALIST}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Khác:</span>
                <span className="font-medium">
                  {competition.participantStats.OTHER}
                </span>
              </div>
            </div>
          )}

          {competition.note && (
            <div className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Ghi chú:</span> {competition.note}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 mt-auto">
          <PermissionGate permission="READ_COMPETITION">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={`/management/competitions/${competition.id}`}>
                <Trophy className="mr-2 h-4 w-4" />
                Chi tiết
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </CardContent>
    </Card>
  );
}
