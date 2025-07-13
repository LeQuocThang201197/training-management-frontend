import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Trophy,
  Users,
  Plus,
  Trash2,
  ChevronLeft,
  Pencil,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { API_URL } from "@/config/api";
import { Competition, CompetitionConcentration } from "@/types/competition";
import { PermissionGate } from "@/components/PermissionGate";
import { ConcentrationCard } from "@/components/cards/ConcentrationCard";

interface CompetitionParticipant {
  competition_id: number;
  participant_id: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  startDate: string;
  created_by: number;
  participation: {
    id: number;
    person_id: number;
    concentration_id: number;
    role_id: number;
    note: string;
    createdAt: string;
    updatedAt: string;
    organization_id: number;
    assigned_by: number;
    person: {
      id: number;
      name: string;
      name_search: string;
      identity_number: string | null;
      identity_date: string | null;
      identity_place: string;
      social_insurance: string | null;
      birthday: string;
      phone: string | null;
      email: string | null;
      gender: string;
      created_by: number;
      createdAt: string;
      updatedAt: string;
    };
    role: {
      id: number;
      name: string;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
    concentration: {
      id: number;
      teamId: number;
      location: string;
      startDate: string;
      endDate: string;
      note: string;
      created_by: number;
      createdAt: string;
      updatedAt: string;
      related_year: number;
      sequence_number: number;
      room: string;
      team: {
        id: number;
        sport: string;
        type: string;
        gender: string;
        createdAt: string;
        updatedAt: string;
        rawData: {
          sportId: number;
          type: string;
          gender: string;
        };
      };
    };
    organization: {
      id: number;
      name: string;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  creator: {
    id: number;
    name: string;
  };
}

export function CompetitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [participants, setParticipants] = useState<CompetitionParticipant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetition = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/competitions/${id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Không thể tải thông tin thi đấu");

      const data = await response.json();
      if (data.success) {
        setCompetition({
          ...data.data,
          participantStats: data.data.participantStats || {
            ATHLETE: 0,
            COACH: 0,
            SPECIALIST: 0,
            OTHER: 0,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/competitions/${id}/participants`,
        {
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("Không thể tải danh sách người tham gia");

      const data = await response.json();
      if (data.success) {
        const responseData = data.data as {
          participants: CompetitionParticipant[];
          stats: {
            ATHLETE: number;
            COACH: number;
            SPECIALIST: number;
            OTHER: number;
          };
        };
        setParticipants(responseData.participants || []);
        // Cập nhật stats trong state riêng hoặc cập nhật competition
        setCompetition((prev) =>
          prev
            ? {
                ...prev,
                participantStats: responseData.stats || {
                  ATHLETE: 0,
                  COACH: 0,
                  SPECIALIST: 0,
                  OTHER: 0,
                },
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCompetition();
      fetchParticipants();
    }
  }, [id, fetchCompetition, fetchParticipants]);

  const handleDeleteParticipant = async (
    participant: CompetitionParticipant
  ) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người tham gia này?")) return;

    try {
      const response = await fetch(
        `${API_URL}/competitions/${id}/participants/${participant.participation.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa người tham gia");

      const data = await response.json();
      if (data.success) {
        fetchParticipants();
      }
    } catch (err) {
      console.error("Delete participant error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi xóa người tham gia");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error || "Không tìm thấy thi đấu"}</p>
      </div>
    );
  }

  const today = new Date();
  const startDate = new Date(competition.startDate);
  const endDate = new Date(competition.endDate);
  endDate.setHours(23, 59, 59, 999);

  const getStatus = () => {
    if (today < startDate) {
      return {
        label: "Sắp diễn ra",
        color: "text-blue-700 bg-blue-50 border-blue-200",
      };
    } else if (today > endDate) {
      return {
        label: "Đã kết thúc",
        color: "text-gray-700 bg-gray-50 border-gray-200",
      };
    } else {
      return {
        label: "Đang diễn ra",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      };
    }
  };

  const status = getStatus();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ATHLETE":
        return "Vận động viên";
      case "COACH":
        return "Huấn luyện viên";
      case "SPECIALIST":
        return "Chuyên gia";
      default:
        return "Khác";
    }
  };

  const getRoleColors = (role: string) => {
    switch (role) {
      case "ATHLETE":
        return {
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          row: "hover:bg-blue-50/50",
        };
      case "COACH":
        return {
          badge: "bg-green-100 text-green-800 border-green-200",
          row: "hover:bg-green-50/50",
        };
      case "SPECIALIST":
        return {
          badge: "bg-purple-100 text-purple-800 border-purple-200",
          row: "hover:bg-purple-50/50",
        };
      default:
        return {
          badge: "bg-orange-100 text-orange-800 border-orange-200",
          row: "hover:bg-orange-50/50",
        };
    }
  };

  const formatParticipantStats = (
    stats:
      | { ATHLETE: number; COACH: number; SPECIALIST: number; OTHER: number }
      | undefined
  ): string => {
    if (
      !stats ||
      (stats.SPECIALIST === 0 && stats.COACH === 0 && stats.ATHLETE === 0)
    ) {
      return "Chưa có người tham gia";
    }

    const parts = [];

    if (stats.SPECIALIST > 0) {
      parts.push(`${stats.SPECIALIST} CG`);
    }

    if (stats.COACH > 0) {
      parts.push(`${stats.COACH} HLV`);
    }

    if (stats.ATHLETE > 0) {
      parts.push(`${stats.ATHLETE} VĐV`);
    }

    return parts.join(" - ");
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      {/* Breadcrumb */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/management/competitions")}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại Danh sách Thi đấu
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold">{competition.name}</h1>
          <div className="flex gap-2">
            <PermissionGate permission="UPDATE_COMPETITION">
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </Button>
            </PermissionGate>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <MapPin className="h-5 w-5 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Địa điểm</p>
                <p className="font-medium">{competition.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <Clock className="h-5 w-5 mr-3 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium">
                  {format(startDate, "dd/MM/yyyy", { locale: vi })} -{" "}
                  {format(endDate, "dd/MM/yyyy", { locale: vi })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <Trophy className="h-5 w-5 mr-3 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-5 w-5 mr-3 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Số lượng thành viên</p>
                <p className="font-medium">
                  {formatParticipantStats(competition.participantStats)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Đội tham gia */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Đội tham gia thi đấu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {competition.concentrations &&
          competition.concentrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competition.concentrations.map(
                (item: CompetitionConcentration) => (
                  <ConcentrationCard
                    key={item.concentration_id}
                    concentration={{
                      ...item.concentration,
                      teamId: item.concentration.team.id,
                      creator_id: competition.created_by,
                      createdAt: item.createdAt,
                      updatedAt: item.createdAt,
                      creator: { ...competition.creator, email: "" },
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có đội tuyển nào tham gia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thống kê */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thống kê người tham gia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {competition.participantStats?.ATHLETE || 0}
              </div>
              <div className="text-sm text-gray-600">Vận động viên</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {competition.participantStats?.COACH || 0}
              </div>
              <div className="text-sm text-gray-600">Huấn luyện viên</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {competition.participantStats?.SPECIALIST || 0}
              </div>
              <div className="text-sm text-gray-600">Chuyên gia</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {competition.participantStats?.OTHER || 0}
              </div>
              <div className="text-sm text-gray-600">Khác</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Người tham gia</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Danh sách người tham gia ({participants.length})
                </CardTitle>
                <PermissionGate permission="CREATE_COMPETITION_PARTICIPANT">
                  <Button onClick={() => alert("Chức năng sẽ được thêm sau")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm người tham gia
                  </Button>
                </PermissionGate>
              </div>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có người tham gia nào</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead className="text-center">Vai trò</TableHead>
                      <TableHead>Đội tuyển</TableHead>
                      <TableHead className="text-center">
                        Ngày tham gia
                      </TableHead>
                      <TableHead className="text-center">
                        Ngày kết thúc
                      </TableHead>
                      <TableHead className="text-center">Ghi chú</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow
                        key={`${participant.participation.person_id}-${participant.participation.role_id}-${participant.participation.concentration_id}`}
                        className={
                          getRoleColors(participant.participation.role.type).row
                        }
                      >
                        <TableCell className="font-medium">
                          {participant.participation.person.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                getRoleColors(
                                  participant.participation.role.type
                                ).badge
                              }`}
                            >
                              {getRoleLabel(
                                participant.participation.role.type
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {participant.participation.concentration.team.sport} -{" "}
                          {participant.participation.concentration.team.type}
                        </TableCell>
                        <TableCell className="text-center">
                          {format(
                            new Date(participant.startDate),
                            "dd/MM/yyyy",
                            {
                              locale: vi,
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(participant.endDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell className="text-center max-w-xs">
                          {participant.note &&
                          participant.note.trim() !== "" ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="line-clamp-2 cursor-help">
                                    {participant.note}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <p>{participant.note}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="text-gray-400 text-center block">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <PermissionGate permission="DELETE_COMPETITION_PARTICIPANT">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() =>
                                handleDeleteParticipant(participant)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Thành tích thi đấu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Thông tin thành tích sẽ được cập nhật sau</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
