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
import { Team } from "@/types/index";
import { ConcentrationDialog } from "@/components/dialogs/ConcentrationDialog";
import { AddParticipantDialog } from "@/components/dialogs/AddParticipantDialog";

interface Paper {
  id: number;
  number: number;
  code: string;
  date: string;
  type: string;
  content: string;
  publisher: string;
}

interface Participant {
  id: number;
  name: string;
  role: string;
  gender: string;
  dob: string;
  avatar?: string;
}

interface ConcentrationDetail extends Concentration {
  participants: Participant[];
  participantsCount: number;
  papers: Paper[];
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

  const handleAddParticipant = async (formData: {
    personId: string;
    roleId: string;
    organizationId: string;
    startDate: string;
    endDate: string;
    note: string;
  }) => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participants`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể thêm thành viên");

      const data = await response.json();
      if (data.success) {
        // Cập nhật lại danh sách thành viên
        setDetail((prev) => ({
          ...prev!,
          participants: [...prev!.participants, data.data],
          participantsCount: prev!.participantsCount + 1,
        }));
        setIsAddParticipantDialogOpen(false);
      }
    } catch (err) {
      console.error("Add participant error:", err);
      alert("Có lỗi xảy ra khi thêm thành viên");
    }
  };

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
            đợt {detail.sequence_number} năm {detail.related_year}
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
              <User className="h-5 w-5 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Số HLV</p>
                <p className="font-medium">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-5 w-5 mr-3 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Số VĐV</p>
                <p className="font-medium">{detail.participantsCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="athletes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="athletes">Danh sách đội</TabsTrigger>
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
              {detail.participants.length > 0 ? (
                <div className="space-y-6">
                  {/* Phần HLV */}
                  <div>
                    <h3 className="font-medium mb-3">Huấn luyện viên</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {detail.participants
                        .filter((p) => p.role === "COACH")
                        .map((coach) => (
                          <Card key={coach.id}>
                            <CardContent className="flex items-center p-4">
                              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                {coach.avatar ? (
                                  <img
                                    src={coach.avatar}
                                    alt={coach.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{coach.name}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(coach.dob).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Phần VĐV */}
                  <div>
                    <h3 className="font-medium mb-3">Vận động viên</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {detail.participants
                        .filter((p) => p.role === "ATHLETE")
                        .map((athlete) => (
                          <Card key={athlete.id}>
                            <CardContent className="flex items-center p-4">
                              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                {athlete.avatar ? (
                                  <img
                                    src={athlete.avatar}
                                    alt={athlete.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{athlete.name}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(athlete.dob).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có thành viên nào trong đợt tập trung
                </div>
              )}
            </CardContent>
          </Card>
          <AddParticipantDialog
            isOpen={isAddParticipantDialogOpen}
            onOpenChange={setIsAddParticipantDialogOpen}
            concentrationStartDate={detail.startDate}
            concentrationEndDate={detail.endDate}
            onSubmit={handleAddParticipant}
          />
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
              <div className="space-y-4">
                {loadingLinkedPapers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : linkedPapers.length > 0 ? (
                  linkedPapers.map((paper) => (
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
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có giấy tờ nào được liên kết
                  </p>
                )}
              </div>
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
    </div>
  );
}
