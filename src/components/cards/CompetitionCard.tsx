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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      return {
        label: "Sắp diễn ra",
        color: "bg-blue-100 text-blue-800",
        gradient: "from-blue-50 to-blue-100",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
      };
    } else if (today > endDate) {
      return {
        label: "Đã kết thúc",
        color: "bg-gray-100 text-gray-800",
        gradient: "from-gray-50 to-gray-100",
        borderColor: "border-gray-200",
        iconColor: "text-gray-600",
      };
    } else {
      return {
        label: "Đang diễn ra",
        color: "bg-green-100 text-green-800",
        gradient: "from-green-50 to-green-100",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
      };
    }
  };

  const getTypeColor = () => {
    if (competition.isForeign) {
      return {
        gradient: "from-purple-50 to-purple-100",
        borderColor: "border-purple-200",
        iconColor: "text-purple-600",
      };
    }
    return {
      gradient: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
    };
  };

  const status = getStatus();
  const typeColor = getTypeColor();
  const totalParticipants = competition.totalParticipants;

  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 flex flex-col h-full border-2 ${status.borderColor} bg-gradient-to-br ${status.gradient} hover:scale-[1.02]`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-800">
            {competition.name}
          </CardTitle>
          <div className="flex gap-1">
            <PermissionGate permission="UPDATE_COMPETITION">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/50"
                onClick={() => onEdit?.(competition)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </PermissionGate>
            <PermissionGate permission="DELETE_COMPETITION">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete?.(competition)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </PermissionGate>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${status.color} font-medium`}>
            {status.label}
          </Badge>
          {competition.is_confirmed && (
            <Badge className="bg-emerald-100 text-emerald-800 font-medium">
              ✓ Đã xác nhận
            </Badge>
          )}
          {competition.isForeign && (
            <Badge className="bg-purple-100 text-purple-800 font-medium border border-purple-200">
              🌍 Quốc tế
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
            <MapPin className={`h-4 w-4 ${typeColor.iconColor}`} />
            <span className="line-clamp-1 font-medium">
              {competition.location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
            <Calendar className={`h-4 w-4 ${typeColor.iconColor}`} />
            <span className="font-medium">
              {format(startDate, "dd/MM/yyyy", { locale: vi })} -{" "}
              {format(endDate, "dd/MM/yyyy", { locale: vi })}
            </span>
          </div>

          {/* Thông tin đợt tập trung */}
          {competition.concentrations &&
            competition.concentrations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Target className={`h-4 w-4 ${typeColor.iconColor}`} />
                  <span className="font-medium">Đội tham gia:</span>
                </div>
                <div className="space-y-2">
                  {competition.concentrations.map(
                    (concentrationItem, index) => (
                      <div
                        key={index}
                        className="text-xs bg-white/70 p-3 rounded-lg border border-white/50 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 mb-1">
                              {concentrationItem.concentration.team.sport}
                            </div>
                            <div className="text-gray-600 mb-1">
                              {concentrationItem.concentration.team.type} -{" "}
                              {concentrationItem.concentration.team.gender}
                            </div>
                            <div className="text-gray-500 text-xs">
                              📍 {concentrationItem.concentration.location}
                            </div>
                            <div className="text-gray-500 text-xs">
                              📅{" "}
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

          <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
            <Users className={`h-4 w-4 ${typeColor.iconColor}`} />
            <span className="font-medium">
              {totalParticipants} người tham gia
            </span>
          </div>

          {totalParticipants > 0 && (
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">VĐV:</span>
                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {competition.participantStats.ATHLETE}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HLV:</span>
                  <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    {competition.participantStats.COACH}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chuyên gia:</span>
                  <span className="font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {competition.participantStats.SPECIALIST}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Khác:</span>
                  <span className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    {competition.participantStats.OTHER}
                  </span>
                </div>
              </div>
            </div>
          )}

          {competition.note && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-gray-700 bg-white/50 p-2 rounded-lg line-clamp-2 cursor-help">
                    <span className="font-medium">📝 Ghi chú:</span>{" "}
                    {competition.note}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs p-3 bg-gray-900 text-white"
                >
                  <div className="font-medium mb-1">📝 Ghi chú:</div>
                  <div className="text-sm whitespace-pre-wrap">
                    {competition.note}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex gap-2 pt-2 mt-auto">
          <PermissionGate permission="READ_COMPETITION">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/80 hover:bg-white border-2 hover:border-gray-300 font-medium"
              asChild
            >
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
