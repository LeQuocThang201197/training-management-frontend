import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  User,
  Users,
  Clock,
  ChevronLeft,
  FileText,
  Plus,
  Link2,
  Pencil,
  Trash2,
  Link2Off,
  Search,
  AlertCircle,
} from "lucide-react";
import { Concentration } from "@/types/concentration";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ParticipantStats, Team } from "@/types/index";
import { ConcentrationDialog } from "@/components/dialogs/ConcentrationDialog";
import { AddParticipantDialog } from "@/components/dialogs/AddParticipantDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ParticipantCard } from "@/components/cards/ParticipantCard";
import { Participant } from "@/types/participant";
import { Input } from "@/components/ui/input";
import { AbsenceRecord } from "@/types/participant";

interface Paper {
  id: number;
  number: number;
  code: string;
  date: string;
  type: string;
  content: string;
  publisher: string;
}

interface ConcentrationDetail extends Concentration {
  participants: Participant[];
  papers: Paper[];
}

interface ParticipantFormData {
  personId: string;
  roleId: string;
  organizationId: string;
  note: string;
}

export function ConcentrationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ConcentrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [linkedPapers, setLinkedPapers] = useState<Paper[]>([]);
  const [loadingLinkedPapers, setLoadingLinkedPapers] = useState(false);
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const [availablePapers, setAvailablePapers] = useState<Paper[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    teamId: 0,
    related_year: new Date().getFullYear(),
    sequence_number: 1,
    location: "",
    startDate: "",
    endDate: "",
  });
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAddParticipantDialogOpen, setIsAddParticipantDialogOpen] =
    useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [participantToDelete, setParticipantToDelete] =
    useState<Participant | null>(null);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/concentrations/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải thông tin chi tiết");

        const data = await response.json();
        if (data.success) {
          setDetail(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoadingParticipants(true);
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participants`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể tải danh sách thành viên");

      const data = await response.json();
      if (data.success) {
        setParticipants(data.data);
      }
    } catch (err) {
      console.error("Fetch participants error:", err);
    } finally {
      setLoadingParticipants(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchParticipants();
    }
  }, [id, fetchParticipants]);

  const handleUpdateNote = async () => {
    try {
      const response = await fetch(`${API_URL}/concentrations/${id}/note`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: noteInput }),
      });

      if (!response.ok) throw new Error("Không thể cập nhật ghi chú");

      const data = await response.json();
      if (data.success) {
        setDetail((prev) => (prev ? { ...prev, note: noteInput } : null));
        setIsNoteDialogOpen(false);
        setNoteInput("");
      }
    } catch (err) {
      console.error("Update note error:", err);
    }
  };

  const handleEditNote = () => {
    if (!detail) return;
    setNoteInput(detail.note || "");
    setIsNoteDialogOpen(true);
  };

  const handleDeleteNote = async () => {
    try {
      const response = await fetch(`${API_URL}/concentrations/${id}/note`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể xóa ghi chú");

      const data = await response.json();
      if (data.success) {
        setDetail((prev) => (prev ? { ...prev, note: "" } : null));
      }
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  const fetchPapers = async () => {
    try {
      setLoadingPapers(true);
      const response = await fetch(`${API_URL}/papers`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Không thể tải danh sách giấy tờ");

      const data = await response.json();
      if (data.success) {
        setPapers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPapers(false);
    }
  };

  const fetchLinkedPapers = useCallback(async () => {
    try {
      setLoadingLinkedPapers(true);
      const response = await fetch(`${API_URL}/concentrations/${id}/papers`, {
        credentials: "include",
      });
      if (!response.ok)
        throw new Error("Không thể tải danh sách giấy tờ liên kết");

      const data = await response.json();
      if (data.success) {
        setLinkedPapers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLinkedPapers(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchLinkedPapers();
  }, [id, fetchLinkedPapers]);

  useEffect(() => {
    const filterAvailablePapers = () => {
      const linkedIds = linkedPapers.map((paper) => paper.id);
      setAvailablePapers(
        papers.filter((paper) => !linkedIds.includes(paper.id))
      );
    };

    filterAvailablePapers();
  }, [papers, linkedPapers]);

  const handleLinkPapers = async () => {
    try {
      const response = await fetch(`${API_URL}/concentrations/${id}/papers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paperIds: selectedPaperIds }),
      });

      if (!response.ok) throw new Error("Không thể liên kết giấy tờ");

      const data = await response.json();
      if (data.success) {
        await fetchLinkedPapers(); // Refresh danh sách giấy tờ đã liên kết
        setSelectedPaperIds([]); // Reset selection
        // Đóng dialog
        const dialogElement = document.querySelector("[data-state='open']");
        if (dialogElement) {
          (dialogElement as HTMLElement).click();
        }
      }
    } catch (err) {
      console.error("Link papers error:", err);
    }
  };

  const handleUnlinkPaper = async (paperId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/papers/${paperId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể bỏ liên kết giấy tờ");

      const data = await response.json();
      if (data.success) {
        await fetchLinkedPapers(); // Refresh danh sách
      }
    } catch (err) {
      console.error("Unlink paper error:", err);
    }
  };

  const handleViewFile = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}/file`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("View file error:", err);
      alert("Không thể mở file");
    }
  };

  const handlePaperSelect = (paper: Paper) => {
    if (linkedPapers.some((linked) => linked.id === paper.id)) {
      alert("Giấy tờ này đã được liên kết với đợt tập trung");
      return;
    }

    setSelectedPaperIds((prev) =>
      prev.includes(paper.id)
        ? prev.filter((id) => id !== paper.id)
        : [...prev, paper.id]
    );
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chuyển đổi tên các trường cho phù hợp với API
      const requestData = {
        teamId: editFormData.teamId,
        related_year: editFormData.related_year,
        sequence_number: editFormData.sequence_number,
        location: editFormData.location,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
      };

      const response = await fetch(`${API_URL}/concentrations/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Không thể cập nhật đợt tập trung");

      const data = await response.json();
      if (data.success) {
        setDetail(data.data);
        setIsEditDialogOpen(false);
      }
    } catch (err) {
      console.error("Update concentration error:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đợt tập trung này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/concentrations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể xóa đợt tập trung");

      const data = await response.json();
      if (data.success) {
        navigate("/management/concentrations");
      }
    } catch (err) {
      console.error("Delete concentration error:", err);
      alert("Có lỗi xảy ra khi xóa đợt tập trung");
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/teams`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách đội");

        const data = await response.json();
        if (data.success) {
          setTeams(data.data);
        }
      } catch (err) {
        console.error("Fetch teams error:", err);
      }
    };

    fetchTeams();
  }, []);

  const handleAddParticipant = async (formData: ParticipantFormData) => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participants`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể thêm thành viên");

      const data = await response.json();
      if (data.success) {
        setParticipants((prev) => [...prev, data.data]);
        fetchParticipantStats(); // Fetch stats mới
        setIsAddParticipantDialogOpen(false);
      }
    } catch (err) {
      console.error("Add participant error:", err);
    }
  };

  const handleDeleteParticipant = async () => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participants/${participantToDelete?.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa thành viên");

      const data = await response.json();
      if (data.success) {
        setParticipants((prev) =>
          prev.filter((p) => p.id !== participantToDelete?.id)
        );
        fetchParticipantStats();
        setParticipantToDelete(null);
      }
    } catch (err) {
      console.error("Delete participant error:", err);
      alert("Có lỗi xảy ra khi xóa thành viên");
    }
  };

  const handleEditParticipant = async (formData: ParticipantFormData) => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participants/${editingParticipant?.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật thành viên");

      const data = await response.json();
      if (data.success) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === editingParticipant?.id ? data.data : p))
        );
        fetchParticipantStats();
        setEditingParticipant(null);
      }
    } catch (err) {
      console.error("Edit participant error:", err);
      alert("Có lỗi xảy ra khi cập nhật thành viên");
    }
  };

  const formatParticipantStats = (stats: ParticipantStats): string => {
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

  const filteredParticipants = participants.filter((p) =>
    p.person.name
      .toLowerCase()
      .includes(participantSearchTerm.toLowerCase().trim())
  );

  // Thêm hàm sắp xếp
  const sortedLinkedPapers = [...linkedPapers].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const fetchAbsences = useCallback(async () => {
    try {
      setLoadingAbsences(true);
      const response = await fetch(`${API_URL}/concentrations/${id}/absences`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải thông tin vắng mặt");

      const data = await response.json();
      if (data.success) {
        setAbsences(data.data);
      }
    } catch (err) {
      console.error("Fetch absences error:", err);
    } finally {
      setLoadingAbsences(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAbsences();
    }
  }, [id, fetchAbsences]);

  const calculateParticipantStats = useCallback(() => {
    const stats: ParticipantStats = {
      SPECIALIST: 0,
      COACH: 0,
      ATHLETE: 0,
      OTHER: 0,
    };

    participants.forEach((p) => {
      // Kiểm tra xem người này có đang trong trạng thái không tham gia không
      const isInactive = absences.some(
        (a) =>
          a.participation.id === p.id &&
          a.type === "INACTIVE" &&
          new Date(a.startDate).getTime() <= new Date().setHours(0, 0, 0, 0) &&
          new Date(a.endDate).getTime() >= new Date().setHours(0, 0, 0, 0)
      );

      // Chỉ tính vào thống kê nếu đang tham gia
      if (!isInactive) {
        switch (p.role.type) {
          case "SPECIALIST":
            stats.SPECIALIST++;
            break;
          case "COACH":
            stats.COACH++;
            break;
          case "ATHLETE":
            stats.ATHLETE++;
            break;
          default:
            stats.OTHER++;
        }
      }
    });

    return stats;
  }, [participants, absences]);

  const participantStats = calculateParticipantStats();

  const fetchParticipantStats = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participant-stats`,
        {
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("Không thể tải thông tin số lượng thành viên");

      const data = await response.json();
      if (data.success) {
        setDetail((prev) =>
          prev ? { ...prev, participantStats: data.data } : null
        );
      }
    } catch (err) {
      console.error("Fetch participant stats error:", err);
    }
  }, [id]);

  const handleAbsenceChange = useCallback(() => {
    fetchAbsences();
    fetchParticipantStats();
  }, [fetchAbsences, fetchParticipantStats]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!detail) {
    return <div>Không tìm thấy thông tin</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      {/* Breadcrumb */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/management/concentrations")}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại Danh sách Tập trung
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold">
            Đội tuyển {detail.team.sport}{" "}
            {detail.team.gender === "Cả nam và nữ"
              ? ""
              : detail.team.gender.toLowerCase() + " "}
            {detail.team.type === "Trẻ"
              ? detail.team.type.toLowerCase() + " "
              : ""}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (detail) {
                  setEditFormData({
                    teamId: detail.teamId,
                    related_year: detail.related_year,
                    sequence_number: detail.sequence_number,
                    location: detail.location,
                    startDate: detail.startDate.split("T")[0],
                    endDate: detail.endDate.split("T")[0],
                  });
                  setTeamSearchTerm(
                    `${detail.team.type} - ${detail.team.sport} (${detail.team.gender})`
                  );
                  setIsEditDialogOpen(true);
                }
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <User className="h-5 w-5 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Đợt</p>
                <p className="font-medium">
                  {detail.sequence_number}/{detail.related_year}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Clock className="h-5 w-5 mr-3 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium">
                  {new Date(detail.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(detail.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <MapPin className="h-5 w-5 mr-3 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Địa điểm</p>
                <p className="font-medium">{detail.location}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-5 w-5 mr-3 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Số lượng thành viên</p>
                <p className="font-medium">
                  {formatParticipantStats(participantStats)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="athletes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="athletes">Danh sách đội</TabsTrigger>
          <TabsTrigger value="absences">Vắng mặt</TabsTrigger>
          <TabsTrigger value="papers">Giấy tờ</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>

        <TabsContent value="athletes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách đội</CardTitle>
                <Button onClick={() => setIsAddParticipantDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thành viên
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm theo tên..."
                  className="pl-10"
                  value={participantSearchTerm}
                  onChange={(e) => setParticipantSearchTerm(e.target.value)}
                />
              </div>

              {loadingParticipants || loadingAbsences ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredParticipants.length > 0 ? (
                <div className="space-y-6">
                  {filteredParticipants.some(
                    (p) => p.role.type === "SPECIALIST"
                  ) && (
                    <div>
                      <h3 className="font-medium mb-3">Chuyên gia</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredParticipants
                          .filter((p) => p.role.type === "SPECIALIST")
                          .map((specialist) => (
                            <ParticipantCard
                              key={specialist.id}
                              participant={specialist}
                              onEdit={setEditingParticipant}
                              onDelete={setParticipantToDelete}
                              onAbsenceChange={handleAbsenceChange}
                              absences={absences.filter((a) => {
                                return a.participation.id === specialist.id;
                              })}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {filteredParticipants.some(
                    (p) => p.role.type === "COACH"
                  ) && (
                    <div>
                      <h3 className="font-medium mb-3">Huấn luyện viên</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredParticipants
                          .filter((p) => p.role.type === "COACH")
                          .map((coach) => (
                            <ParticipantCard
                              key={coach.id}
                              participant={coach}
                              onEdit={setEditingParticipant}
                              onDelete={setParticipantToDelete}
                              onAbsenceChange={handleAbsenceChange}
                              absences={absences.filter((a) => {
                                return a.participation.id === coach.id;
                              })}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {filteredParticipants.some(
                    (p) => p.role.type === "ATHLETE"
                  ) && (
                    <div>
                      <h3 className="font-medium mb-3">Vận động viên</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredParticipants
                          .filter((p) => p.role.type === "ATHLETE")
                          .map((athlete) => (
                            <ParticipantCard
                              key={athlete.id}
                              participant={athlete}
                              onEdit={setEditingParticipant}
                              onDelete={setParticipantToDelete}
                              onAbsenceChange={handleAbsenceChange}
                              absences={absences.filter((a) => {
                                return a.participation.id === athlete.id;
                              })}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {filteredParticipants.some(
                    (p) => p.role.type === "OTHER"
                  ) && (
                    <div>
                      <h3 className="font-medium mb-3">Khác</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredParticipants
                          .filter((p) => p.role.type === "OTHER")
                          .map((other) => (
                            <ParticipantCard
                              key={other.id}
                              participant={other}
                              onEdit={setEditingParticipant}
                              onDelete={setParticipantToDelete}
                              onAbsenceChange={handleAbsenceChange}
                              absences={absences.filter((a) => {
                                return a.participation.id === other.id;
                              })}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {participants.length === 0
                    ? "Chưa có thành viên nào trong đợt tập trung"
                    : "Không tìm thấy thành viên nào"}
                </div>
              )}
            </CardContent>
          </Card>
          <AddParticipantDialog
            isOpen={isAddParticipantDialogOpen}
            onOpenChange={setIsAddParticipantDialogOpen}
            onSubmit={handleAddParticipant}
            existingParticipants={participants}
          />
        </TabsContent>

        <TabsContent value="absences">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách vắng mặt</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAbsences ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : absences.length > 0 ? (
                <div className="space-y-4">
                  {absences.map((absence) => (
                    <div key={absence.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">
                              {absence.participation.person.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                              ({absence.participation.role.name} -{" "}
                              {absence.participation.organization.name})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {absence.type === "INACTIVE" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>
                              {absence.type === "INACTIVE"
                                ? "Không tham gia đợt tập trung"
                                : "Nghỉ phép"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(absence.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -{" "}
                            {absence.endDate &&
                              new Date(absence.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                          </div>
                          {absence.note && (
                            <div className="text-sm text-gray-600 mt-1">
                              {absence.note}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-2">
                            Người tạo: {absence.creator.name} -{" "}
                            {new Date(absence.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có thông tin vắng mặt
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="papers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Giấy tờ</CardTitle>
              <div className="flex gap-2">
                <Dialog
                  onOpenChange={(open) => {
                    if (open) fetchPapers();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Link2 className="h-4 w-4 mr-2" />
                      Gán giấy tờ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Liên kết giấy tờ</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {loadingPapers ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {availablePapers.length > 0 ? (
                            availablePapers.map((paper) => (
                              <Card
                                key={paper.id}
                                className={cn(
                                  "hover:bg-gray-50",
                                  selectedPaperIds.includes(paper.id) &&
                                    "border-primary"
                                )}
                                onClick={() => {
                                  handlePaperSelect(paper);
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                      <FileText className="h-5 w-5 text-gray-500 mt-1" />
                                      <div>
                                        <p className="font-medium">
                                          {paper.type} - Số: {paper.number}/
                                          {paper.code}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {new Date(
                                            paper.date
                                          ).toLocaleDateString("vi-VN")}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {paper.content}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p className="text-center py-4 text-gray-500">
                              Không còn giấy tờ nào có thể liên kết
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleLinkPapers}
                        disabled={selectedPaperIds.length === 0}
                      >
                        Liên kết {selectedPaperIds.length} giấy tờ
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    {/* <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm giấy tờ
                    </Button> */}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chọn giấy tờ</DialogTitle>
                    </DialogHeader>
                    {/* Thêm nội dung dialog sau */}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loadingLinkedPapers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : sortedLinkedPapers.length > 0 ? (
                <div className="space-y-4">
                  {sortedLinkedPapers.map((paper) => (
                    <Card key={paper.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div
                            className="flex items-start space-x-4 flex-1 cursor-pointer hover:bg-gray-50"
                            onClick={() =>
                              navigate(`/management/papers/${paper.id}`)
                            }
                          >
                            <FileText className="h-5 w-5 text-gray-500 mt-1" />
                            <div>
                              <p className="font-medium">
                                {paper.type} - Số: {paper.number}/{paper.code}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(paper.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {paper.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewFile(paper.id)}
                            >
                              Xem file
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleUnlinkPaper(paper.id)}
                            >
                              <Link2Off className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Chưa có giấy tờ nào được liên kết
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ghi chú</CardTitle>
              <div className="flex gap-2">
                {detail.note ? (
                  <>
                    <Dialog
                      open={isNoteDialogOpen}
                      onOpenChange={setIsNoteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditNote}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Sửa ghi chú
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {detail.note ? "Sửa ghi chú" : "Tạo ghi chú"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Nhập ghi chú..."
                          />
                          <div className="flex justify-end">
                            <Button onClick={handleUpdateNote}>Lưu</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={handleDeleteNote}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa ghi chú
                    </Button>
                  </>
                ) : (
                  <Dialog
                    open={isNoteDialogOpen}
                    onOpenChange={setIsNoteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo ghi chú
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {detail.note ? "Sửa ghi chú" : "Tạo ghi chú"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <textarea
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          className="w-full min-h-[100px] p-2 border rounded-md"
                          placeholder="Nhập ghi chú..."
                        />
                        <div className="flex justify-end">
                          <Button onClick={handleUpdateNote}>Lưu</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-4">
                {detail.note || "Không có ghi chú"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConcentrationDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleEdit}
        teams={teams}
        teamSearchTerm={teamSearchTerm}
        setTeamSearchTerm={setTeamSearchTerm}
        isTeamDropdownOpen={isTeamDropdownOpen}
        setIsTeamDropdownOpen={setIsTeamDropdownOpen}
        mode="edit"
      />

      <AlertDialog
        open={!!participantToDelete}
        onOpenChange={(open) => !open && setParticipantToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Thành viên "{participantToDelete?.person.name}" sẽ bị xóa khỏi đợt
              tập trung này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-4">
            <AlertDialogCancel className="w-full sm:w-32 bg-gray-100 hover:bg-gray-200 border-none text-gray-900">
              Không
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteParticipant}
              className="w-full sm:w-32 bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Có, xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddParticipantDialog
        isOpen={!!editingParticipant}
        onOpenChange={(open) => !open && setEditingParticipant(null)}
        onSubmit={handleEditParticipant}
        editData={editingParticipant}
        existingParticipants={participants}
      />
    </div>
  );
}
