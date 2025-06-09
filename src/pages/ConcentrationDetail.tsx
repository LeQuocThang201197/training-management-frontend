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
  LogOut,
  PlusCircle,
  Calendar,
  Plane,
  Home,
  Contact,
  ChevronRight,
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
import { ParticipantStats } from "@/types/index";
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
import { TrainingDialog } from "@/components/dialogs/TrainingDialog";
import { AddTrainingParticipantDialog } from "@/components/dialogs/AddTrainingParticipantDialog";
import {
  Competition,
  CompetitionFormData,
  CompetitionParticipantResponse,
} from "@/types/competition";
import { CompetitionDialog } from "@/components/dialogs/CompetitionDialog";
import { AddCompetitionParticipantDialog } from "@/components/dialogs/AddCompetitionParticipantDialog";
import { ParticipantFormData } from "@/types/participant";
import { AddParticipantMultiDialog } from "@/components/dialogs/AddParticipantMultiDialog";

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

interface Training {
  id: number;
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  note?: string;
  participantStats?: {
    ATHLETE: number;
    COACH: number;
    SPECIALIST: number;
    OTHER: number;
  };
}

interface TrainingFormData {
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  concentration_id: string;
  note?: string;
}

interface TrainingParticipant {
  id: number;
  participation_id: number;
  participation: {
    id: number;
  };
}

const formatDateRange = (start: string, end: string) => {
  return `${new Date(start).toLocaleDateString("vi-VN")} - ${new Date(
    end
  ).toLocaleDateString("vi-VN")}`;
};

export function ConcentrationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ConcentrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [linkedPapers, setLinkedPapers] = useState<Paper[]>([]);
  const [loadingLinkedPapers, setLoadingLinkedPapers] = useState(false);
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const [availablePapers, setAvailablePapers] = useState<Paper[]>([]);
  const [isAddParticipantDialogOpen, setIsAddParticipantDialogOpen] =
    useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [participantToDelete, setParticipantToDelete] =
    useState<Participant | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<
    (ParticipantFormData & { id?: number }) | null
  >(null);
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [trainingEvents, setTrainingEvents] = useState<Training[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loadingCompetitions, setLoadingCompetitions] = useState(false);
  const [isAddTrainingDialogOpen, setIsAddTrainingDialogOpen] = useState(false);
  const [trainingFormData, setTrainingFormData] = useState<TrainingFormData>({
    location: "",
    isForeign: false,
    startDate: "",
    endDate: "",
    concentration_id: id || "",
    note: "",
  });
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(
    null
  );
  const [
    isAddTrainingParticipantDialogOpen,
    setIsAddTrainingParticipantDialogOpen,
  ] = useState(false);
  const [managingTraining, setManagingTraining] = useState<Training | null>(
    null
  );
  const [trainingParticipantIds, setTrainingParticipantIds] = useState<
    number[]
  >([]);
  const [participantNotes, setParticipantNotes] = useState<{
    [key: number]: string;
  }>({});
  const [isCompetitionDialogOpen, setIsCompetitionDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] =
    useState<Competition | null>(null);
  const [competitionToDelete, setCompetitionToDelete] =
    useState<Competition | null>(null);
  const [
    isAddCompetitionParticipantDialogOpen,
    setIsAddCompetitionParticipantDialogOpen,
  ] = useState(false);
  const [managingCompetition, setManagingCompetition] =
    useState<Competition | null>(null);
  const [competitionParticipantIds, setCompetitionParticipantIds] = useState<
    number[]
  >([]);
  const [participantDates, setParticipantDates] = useState<{
    [key: number]: { startDate: string; endDate: string };
  }>({});
  const [trainingParticipants, setTrainingParticipants] = useState<{
    [trainingId: number]: number[];
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [isLinkPaperDialogOpen, setIsLinkPaperDialogOpen] = useState(false);
  // Thêm state để lưu thông tin pagination
  const [papersPagination, setPapersPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  // Thêm state cho dialog mới
  const [isAddParticipantMultiDialogOpen, setIsAddParticipantMultiDialogOpen] =
    useState(false);

  const fetchConcentration = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/concentrations/${id}`, {
        credentials: "include",
      });
      if (!response.ok)
        throw new Error("Không thể tải thông tin đợt tập trung");

      const data = await response.json();
      if (data.success) {
        setDetail(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConcentration();
  }, [fetchConcentration]);

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

      const data = await response.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      }
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

  const initEditParticipant = (participant: Participant) => {
    setEditingParticipant({
      id: participant.id,
      personId: participant.person.id.toString(),
      roleId: participant.role.id.toString(),
      organizationId: participant.organization.id.toString(),
      note: participant.note || "",
      // Thêm các object đầy đủ
      person: participant.person,
      role: participant.role,
      organization: participant.organization,
    });
  };

  const handleEditParticipant = async (formData: ParticipantFormData) => {
    try {
      const response = await fetch(
        `${API_URL}/concentrations/${id}/participants/${editingParticipant?.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
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

  const formatParticipantStats = (
    stats: ParticipantStats | undefined
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

  const fetchTrainingEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/trainings/concentration/${id}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải danh sách tập huấn");

      const data = await response.json();
      if (data.success) {
        setTrainingEvents(data.data);

        // Fetch thông tin người tham gia cho mỗi training
        data.data.forEach(async (training: Training) => {
          const participantsResponse = await fetch(
            `${API_URL}/trainings/${training.id}/participants`,
            {
              credentials: "include",
            }
          );

          if (participantsResponse.ok) {
            const participantsData = await participantsResponse.json();
            if (participantsData.success) {
              // Lưu danh sách ID người tham gia
              setTrainingParticipants((prev) => ({
                ...prev,
                [training.id]: participantsData.data.participants.map(
                  (p: TrainingParticipant) => p.participation.id
                ),
              }));

              // Cập nhật stats cho training
              setTrainingEvents((prev) =>
                prev.map((t) =>
                  t.id === training.id
                    ? { ...t, participantStats: participantsData.data.stats }
                    : t
                )
              );
            }
          }
        });
      }
    } catch (err) {
      console.error("Fetch trainings error:", err);
    }
  }, [id]);

  const fetchCompetitions = useCallback(async () => {
    if (!id) return;

    try {
      setLoadingCompetitions(true);
      const response = await fetch(
        `${API_URL}/competitions/concentration/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể tải danh sách thi đấu");

      const data = await response.json();
      if (data.success) {
        setCompetitions(data.data);
        // Fetch thông tin người tham gia cho mỗi competition
        data.data.forEach((competition: Competition) => {
          fetchCompetitionParticipants(competition.id);
        });
      }
    } catch (err) {
      console.error("Fetch competitions error:", err);
    } finally {
      setLoadingCompetitions(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchParticipants();
      fetchTrainingEvents();
      fetchCompetitions();
    }
  }, [id, fetchParticipants, fetchTrainingEvents, fetchCompetitions]);

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/trainings`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingFormData),
      });

      if (!response.ok) throw new Error("Không thể tạo đợt tập huấn");

      const data = await response.json();
      if (data.success) {
        setTrainingEvents((prev) => [...prev, data.data]);
        setIsAddTrainingDialogOpen(false);
        resetTrainingFormData();
      }
    } catch (err) {
      console.error("Add training error:", err);
    }
  };

  const handleDeleteTraining = async () => {
    if (!trainingToDelete) return;
    try {
      const response = await fetch(
        `${API_URL}/trainings/${trainingToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa đợt tập huấn");

      const data = await response.json();
      if (data.success) {
        setTrainingEvents((prev) =>
          prev.filter((t) => t.id !== trainingToDelete.id)
        );
        setTrainingToDelete(null);
      }
    } catch (err) {
      console.error("Delete training error:", err);
    }
  };

  const handleEditTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTraining) return;
    try {
      const response = await fetch(
        `${API_URL}/trainings/${editingTraining.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainingFormData),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật đợt tập huấn");

      const data = await response.json();
      if (data.success) {
        setTrainingEvents((prev) =>
          prev.map((t) => (t.id === editingTraining.id ? data.data : t))
        );
        setEditingTraining(null);
        resetTrainingFormData();
      }
    } catch (err) {
      console.error("Update training error:", err);
    }
  };

  // Cập nhật hàm helper để xử lý chính xác thời gian
  const getTrainingStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Set thời gian kết thúc là cuối ngày (23:59:59)
    end.setHours(23, 59, 59, 999);

    if (today < start)
      return {
        label: "Chưa diễn ra",
        color: "text-blue-700 bg-blue-50 border-blue-200",
      };
    if (today > end)
      return {
        label: "Đã kết thúc",
        color: "text-gray-700 bg-gray-50 border-gray-200",
      };
    return {
      label: "Đang diễn ra",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  };

  // Thêm hàm helper để reset form
  const resetTrainingFormData = () => {
    setTrainingFormData({
      location: "",
      isForeign: false,
      startDate: "",
      endDate: "",
      concentration_id: id || "",
      note: "",
    });
  };

  const handleNoteChange = (participantId: number, note: string) => {
    setParticipantNotes((prev) => ({
      ...prev,
      [participantId]: note,
    }));
  };

  const handleUpdateTrainingParticipants = async (selectedIds: number[]) => {
    try {
      const response = await fetch(
        `${API_URL}/trainings/${managingTraining?.id}/participants`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participationIds: selectedIds,
          }),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật người tham gia");

      const data = await response.json();
      if (data.success) {
        // Fetch lại thông tin người tham gia và stats
        const participantsResponse = await fetch(
          `${API_URL}/trainings/${managingTraining?.id}/participants`,
          {
            credentials: "include",
          }
        );

        if (participantsResponse.ok) {
          const participantsData = await participantsResponse.json();
          if (participantsData.success) {
            // Cập nhật danh sách người tham gia
            setTrainingParticipants((prev) => ({
              ...prev,
              [managingTraining?.id || 0]:
                participantsData.data.participants.map(
                  (p: TrainingParticipant) => p.participation.id
                ),
            }));

            // Cập nhật stats
            setTrainingEvents((prev) =>
              prev.map((t) =>
                t.id === managingTraining?.id
                  ? { ...t, participantStats: participantsData.data.stats }
                  : t
              )
            );
          }
        }

        setIsAddTrainingParticipantDialogOpen(false);
        setManagingTraining(null);
        setTrainingParticipantIds([]);
      }
    } catch (err) {
      console.error("Update training participants error:", err);
      alert("Có lỗi xảy ra khi cập nhật người tham gia");
    }
  };

  const handleAddCompetition = async (formData: CompetitionFormData) => {
    try {
      const response = await fetch(`${API_URL}/competitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          concentration_id: id,
        }),
      });

      if (!response.ok) throw new Error("Không thể tạo đợt thi đấu");

      const data = await response.json();
      if (data.success) {
        setCompetitions((prev) => [...prev, data.data]);
        setIsCompetitionDialogOpen(false);
      }
    } catch (err) {
      console.error("Add competition error:", err);
    }
  };

  const handleDeleteCompetition = async () => {
    if (!competitionToDelete) return;
    try {
      const response = await fetch(
        `${API_URL}/competitions/${competitionToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa đợt thi đấu");

      const data = await response.json();
      if (data.success) {
        setCompetitions((prev) =>
          prev.filter((c) => c.id !== competitionToDelete.id)
        );
        setCompetitionToDelete(null);
      }
    } catch (err) {
      console.error("Delete competition error:", err);
    }
  };

  const handleUpdateCompetitionParticipants = async (selectedIds: number[]) => {
    if (!managingCompetition) return;

    try {
      const participantDetails = selectedIds
        .filter((id) => {
          const hasNote = participantNotes[id]?.trim() !== "";
          const hasDifferentDates =
            participantDates[id] &&
            (participantDates[id].startDate !==
              managingCompetition.startDate.split("T")[0] ||
              participantDates[id].endDate !==
                managingCompetition.endDate.split("T")[0]);
          return hasNote || hasDifferentDates;
        })
        .map((id) => ({
          participation_id: id,
          startDate:
            participantDates[id]?.startDate ||
            managingCompetition.startDate.split("T")[0],
          endDate:
            participantDates[id]?.endDate ||
            managingCompetition.endDate.split("T")[0],
          note: participantNotes[id]?.trim() || "",
        }));

      const response = await fetch(
        `${API_URL}/competitions/${managingCompetition.id}/participants`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            participationIds: selectedIds,
            ...(participantDetails.length > 0 && { participantDetails }),
          }),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật người tham gia");

      // Xóa notes và dates của những người không được chọn
      const updatedNotes = { ...participantNotes };
      const updatedDates = { ...participantDates };
      Object.keys(updatedNotes).forEach((id) => {
        if (!selectedIds.includes(Number(id))) {
          delete updatedNotes[Number(id)];
          delete updatedDates[Number(id)];
        }
      });
      setParticipantNotes(updatedNotes);
      setParticipantDates(updatedDates);

      await fetchCompetitionParticipants(managingCompetition.id);
      setIsAddCompetitionParticipantDialogOpen(false);
    } catch (err) {
      console.error("Update competition participants error:", err);
    }
  };

  const fetchCompetitionParticipants = async (competitionId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/competitions/${competitionId}/participants`,
        {
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("Không thể tải danh sách người tham gia");

      const data = await response.json();
      if (data.success) {
        const responseData = data.data as CompetitionParticipantResponse;

        setCompetitionParticipantIds(
          responseData.participants.map((p) => p.participation_id)
        );

        // Cập nhật stats của competition
        setCompetitions((prev) =>
          prev.map((c) =>
            c.id === competitionId
              ? { ...c, participantStats: responseData.stats }
              : c
          )
        );

        const notes: { [key: number]: string } = {};
        const dates: { [key: number]: { startDate: string; endDate: string } } =
          {};

        responseData.participants.forEach((p) => {
          if (p.note) notes[p.participation_id] = p.note;
          if (p.startDate || p.endDate) {
            dates[p.participation_id] = {
              startDate: p.startDate,
              endDate: p.endDate,
            };
          }
        });

        setParticipantNotes(notes);
        setParticipantDates(dates);
      }
    } catch (err) {
      console.error("Fetch competition participants error:", err);
    }
  };

  // Thêm hàm xử lý chỉnh sửa competition
  const handleEditCompetition = async (formData: CompetitionFormData) => {
    if (!editingCompetition) return;

    try {
      const response = await fetch(
        `${API_URL}/competitions/${editingCompetition.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            concentration_id: id,
          }),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật đợt thi đấu");

      const data = await response.json();
      if (data.success) {
        setCompetitions((prev) =>
          prev.map((c) => (c.id === editingCompetition.id ? data.data : c))
        );
        setIsCompetitionDialogOpen(false);
        setEditingCompetition(null);
      }
    } catch (err) {
      console.error("Edit competition error:", err);
    }
  };

  // Thêm hàm helper để kiểm tra sự kiện đang diễn ra
  const isOngoing = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  };

  const handleManageTrainingParticipants = async (training: Training) => {
    try {
      setManagingTraining(training);

      // Lấy danh sách ID người tham gia của training này
      setTrainingParticipantIds(trainingParticipants[training.id] || []);

      setIsAddTrainingParticipantDialogOpen(true);
    } catch (err) {
      console.error("Fetch training participants error:", err);
    }
  };

  // Cập nhật hàm fetch papers
  const fetchAvailablePapers = useCallback(async () => {
    try {
      setLoadingPapers(true);
      const response = await fetch(
        `${API_URL}/concentrations/${id}/available-papers?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Không thể tải danh sách giấy tờ");
      const data = await response.json();
      if (data.success) {
        setAvailablePapers(data.data);
        setPapersPagination({
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error("Fetch available papers error:", err);
    } finally {
      setLoadingPapers(false);
    }
  }, [id, currentPage, searchTerm]);

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch lại khi page hoặc search thay đổi
  useEffect(() => {
    if (isLinkPaperDialogOpen) {
      fetchAvailablePapers();
    }
  }, [isLinkPaperDialogOpen, currentPage, searchTerm, fetchAvailablePapers]);

  // Thêm hàm helper để sắp xếp HLV
  const sortCoaches = (coaches: Participant[]) => {
    return [...coaches].sort((a, b) => {
      // HLV trưởng luôn đứng đầu
      if (a.role.name.toLowerCase().includes("trưởng")) return -1;
      if (b.role.name.toLowerCase().includes("trưởng")) return 1;

      // Các HLV khác giữ nguyên thứ tự
      return 0;
    });
  };

  // Thêm handler cho dialog mới
  const handleAddParticipantMulti = async (data: unknown) => {
    console.log("Multi dialog data:", data);

    if (
      data &&
      typeof data === "object" &&
      "type" in data &&
      data.type === "new-person"
    ) {
      // Xử lý thêm nhân sự mới vào đợt tập trung
      const participantData = data as unknown as {
        personId: string;
        roleId: string;
        organizationId: string;
        note: string;
      };
      try {
        const response = await fetch(
          `${API_URL}/concentrations/${id}/participants`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personId: participantData.personId,
              roleId: participantData.roleId,
              organizationId: participantData.organizationId,
              note: participantData.note,
            }),
          }
        );

        if (!response.ok) throw new Error("Không thể thêm thành viên");

        const result = await response.json();
        if (result.success) {
          setParticipants((prev) => [...prev, result.data]);
          fetchParticipantStats();
          setIsAddParticipantMultiDialogOpen(false);
          alert("Đã tạo nhân sự mới và thêm vào đợt tập trung thành công!");
        }
      } catch (err) {
        console.error("Add participant error:", err);
        alert("Có lỗi xảy ra khi thêm thành viên");
      }
    } else if (
      data &&
      typeof data === "object" &&
      "type" in data &&
      data.type === "from-list"
    ) {
      // Xử lý thêm từ danh sách
      const listData = data as unknown as {
        personId: string;
        roleId: string;
        organizationId: string;
        note: string;
      };
      try {
        const response = await fetch(
          `${API_URL}/concentrations/${id}/participants`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personId: listData.personId,
              roleId: listData.roleId,
              organizationId: listData.organizationId,
              note: listData.note,
            }),
          }
        );

        if (!response.ok) throw new Error("Không thể thêm thành viên");

        const result = await response.json();
        if (result.success) {
          setParticipants((prev) => [...prev, result.data]);
          fetchParticipantStats();
          setIsAddParticipantMultiDialogOpen(false);
          alert("Đã thêm thành viên từ danh sách thành công!");
        }
      } catch (err) {
        console.error("Add participant from list error:", err);
        alert("Có lỗi xảy ra khi thêm thành viên");
      }
    } else {
      // TODO: Implement cho tab khác
      setIsAddParticipantMultiDialogOpen(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!detail) {
    return <div>Không tìm thấy thông tin</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
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
              className="gap-2"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa</span>
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
                <div className="flex gap-2">
                  {/* Nút cũ */}
                  <Button
                    onClick={() => setIsAddParticipantDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thành viên (Cũ)
                  </Button>

                  {/* Nút mới */}
                  <Button
                    onClick={() => setIsAddParticipantMultiDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thành viên (Mới)
                  </Button>
                </div>
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
                  clearable
                />
              </div>

              {loadingParticipants || loadingAbsences ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-primary"></div>
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
                          .map((specialist) => {
                            // Tìm training đang diễn ra mà người này tham gia
                            const ongoingTraining = trainingEvents.find(
                              (training) =>
                                isOngoing(
                                  training.startDate,
                                  training.endDate
                                ) &&
                                trainingParticipants[training.id]?.includes(
                                  specialist.id
                                )
                            );

                            // Tìm competition đang diễn ra mà người này tham gia
                            const ongoingCompetition = competitions.find(
                              (competition) =>
                                isOngoing(
                                  competition.startDate,
                                  competition.endDate
                                ) &&
                                competitionParticipantIds.includes(
                                  specialist.id
                                )
                            );

                            return (
                              <ParticipantCard
                                key={specialist.id}
                                participant={specialist}
                                onEdit={() => initEditParticipant(specialist)}
                                onDelete={() =>
                                  setParticipantToDelete(specialist)
                                }
                                absences={absences.filter((a) => {
                                  return a.participation.id === specialist.id;
                                })}
                                onAbsenceChange={fetchAbsences}
                                ongoingTraining={ongoingTraining}
                                ongoingCompetition={ongoingCompetition}
                              />
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {filteredParticipants.some(
                    (p) => p.role.type === "COACH"
                  ) && (
                    <div>
                      <h3 className="font-medium mb-3">Huấn luyện viên</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortCoaches(
                          filteredParticipants.filter(
                            (p) => p.role.type === "COACH"
                          )
                        ).map((coach) => {
                          // Tìm training đang diễn ra mà người này tham gia
                          const ongoingTraining = trainingEvents.find(
                            (training) =>
                              isOngoing(training.startDate, training.endDate) &&
                              trainingParticipants[training.id]?.includes(
                                coach.id
                              )
                          );

                          // Tìm competition đang diễn ra mà người này tham gia
                          const ongoingCompetition = competitions.find(
                            (competition) =>
                              isOngoing(
                                competition.startDate,
                                competition.endDate
                              ) && competitionParticipantIds.includes(coach.id)
                          );

                          return (
                            <ParticipantCard
                              key={coach.id}
                              participant={coach}
                              onEdit={() => initEditParticipant(coach)}
                              onDelete={() => setParticipantToDelete(coach)}
                              absences={absences.filter((a) => {
                                return a.participation.id === coach.id;
                              })}
                              onAbsenceChange={fetchAbsences}
                              ongoingTraining={ongoingTraining}
                              ongoingCompetition={ongoingCompetition}
                            />
                          );
                        })}
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
                          .map((athlete) => {
                            // Tìm training đang diễn ra mà người này tham gia
                            const ongoingTraining = trainingEvents.find(
                              (training) =>
                                isOngoing(
                                  training.startDate,
                                  training.endDate
                                ) &&
                                trainingParticipants[training.id]?.includes(
                                  athlete.id
                                )
                            );

                            // Tìm competition đang diễn ra mà người này tham gia
                            const ongoingCompetition = competitions.find(
                              (competition) =>
                                isOngoing(
                                  competition.startDate,
                                  competition.endDate
                                ) &&
                                competitionParticipantIds.includes(athlete.id)
                            );

                            return (
                              <ParticipantCard
                                key={athlete.id}
                                participant={athlete}
                                onEdit={() => initEditParticipant(athlete)}
                                onDelete={() => setParticipantToDelete(athlete)}
                                absences={absences.filter((a) => {
                                  return a.participation.id === athlete.id;
                                })}
                                onAbsenceChange={fetchAbsences}
                                ongoingTraining={ongoingTraining}
                                ongoingCompetition={ongoingCompetition}
                              />
                            );
                          })}
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
                          .map((other) => {
                            // Tìm training đang diễn ra mà người này tham gia
                            const ongoingTraining = trainingEvents.find(
                              (training) =>
                                isOngoing(
                                  training.startDate,
                                  training.endDate
                                ) &&
                                trainingParticipants[training.id]?.includes(
                                  other.id
                                )
                            );

                            // Tìm competition đang diễn ra mà người này tham gia
                            const ongoingCompetition = competitions.find(
                              (competition) =>
                                isOngoing(
                                  competition.startDate,
                                  competition.endDate
                                ) &&
                                competitionParticipantIds.includes(other.id)
                            );

                            return (
                              <ParticipantCard
                                key={other.id}
                                participant={other}
                                onEdit={() => initEditParticipant(other)}
                                onDelete={() => setParticipantToDelete(other)}
                                absences={absences.filter((a) => {
                                  return a.participation.id === other.id;
                                })}
                                onAbsenceChange={fetchAbsences}
                                ongoingTraining={ongoingTraining}
                                ongoingCompetition={ongoingCompetition}
                              />
                            );
                          })}
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
            isOpen={isAddParticipantDialogOpen || !!editingParticipant}
            onOpenChange={(open) => {
              setIsAddParticipantDialogOpen(open);
              if (!open) setEditingParticipant(null);
            }}
            onSubmit={
              editingParticipant ? handleEditParticipant : handleAddParticipant
            }
            editData={editingParticipant}
            existingParticipants={participants}
          />
        </TabsContent>

        <TabsContent value="absences">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
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
                              <LogOut className="h-4 w-4 text-red-500" />
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
                  open={isLinkPaperDialogOpen}
                  onOpenChange={(open) => {
                    setIsLinkPaperDialogOpen(open);
                    if (open) fetchPapers();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Link2 className="h-4 w-4" />
                      <span>Gán giấy tờ</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Liên kết giấy tờ</DialogTitle>
                    </DialogHeader>

                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Tìm kiếm giấy tờ..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Thêm thông tin số lượng */}
                    <div className="text-sm text-gray-500 mb-4">
                      {searchTerm ? (
                        <span>Tìm thấy {papersPagination.total} kết quả</span>
                      ) : (
                        <span>
                          Có {papersPagination.total} giấy tờ có thể liên kết
                        </span>
                      )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                      {loadingPapers ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-gray-900" />
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
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div
                                      className="flex items-start space-x-4 flex-1 cursor-pointer"
                                      onClick={() => handlePaperSelect(paper)}
                                    >
                                      <FileText className="h-5 w-5 text-gray-500 mt-1" />
                                      <div>
                                        <p className="font-medium">
                                          {paper.type}{" "}
                                          {paper.number && paper.code && (
                                            <>
                                              - Số: {paper.number}/{paper.code}
                                            </>
                                          )}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {paper.publisher}
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
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Ngăn việc chọn card khi click nút
                                        handleViewFile(paper.id);
                                      }}
                                    >
                                      Xem file
                                    </Button>
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

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1 || loadingPapers}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Thêm hiển thị số trang */}
                        <div className="flex items-center text-sm text-gray-600">
                          <span>
                            Trang {currentPage} / {papersPagination.totalPages}
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((p) =>
                              Math.min(papersPagination.totalPages, p + 1)
                            )
                          }
                          disabled={
                            currentPage === papersPagination.totalPages ||
                            loadingPapers
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleLinkPapers}
                        disabled={selectedPaperIds.length === 0}
                      >
                        Liên kết {selectedPaperIds.length} giấy tờ
                      </Button>
                    </div>
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
                                {paper.type}{" "}
                                {paper.number && paper.code && (
                                  <>
                                    - Số: {paper.number}/{paper.code}
                                  </>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                {paper.publisher}
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
                          className="gap-2"
                          onClick={handleEditNote}
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Sửa ghi chú</span>
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
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa ghi chú</span>
                    </Button>
                  </>
                ) : (
                  <Dialog
                    open={isNoteDialogOpen}
                    onOpenChange={setIsNoteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Tạo ghi chú</span>
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
        onSubmit={async (formData) => {
          try {
            const response = await fetch(`${API_URL}/concentrations/${id}`, {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            if (!response.ok)
              throw new Error("Không thể cập nhật đợt tập trung");

            const data = await response.json();
            if (data.success) {
              fetchConcentration();
              setIsEditDialogOpen(false);
            }
          } catch (err) {
            console.error("Update concentration error:", err);
            alert(
              err instanceof Error
                ? err.message
                : "Lỗi khi cập nhật đợt tập trung"
            );
          }
        }}
        mode="edit"
        editData={{
          teamId: detail.teamId,
          location: detail.location,
          room: detail.room,
          related_year: detail.related_year,
          sequence_number: detail.sequence_number,
          startDate: detail.startDate,
          endDate: detail.endDate,
          note: detail.note,
        }}
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

      <div className="space-y-6 mt-10">
        <h3 className="text-lg font-medium">Các đợt tập huấn & thi đấu</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Đợt tập huấn */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tập huấn</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsAddTrainingDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Thêm tập huấn</span>
              </Button>
            </CardHeader>
            <TrainingDialog
              isOpen={isAddTrainingDialogOpen || !!editingTraining}
              onOpenChange={(open) => {
                if (!open) {
                  resetTrainingFormData();
                  setIsAddTrainingDialogOpen(false);
                  setEditingTraining(null);
                }
              }}
              formData={trainingFormData}
              setFormData={setTrainingFormData}
              onSubmit={
                editingTraining ? handleEditTraining : handleAddTraining
              }
              mode={editingTraining ? "edit" : "add"}
            />
            <CardContent>
              {trainingEvents.length > 0 ? (
                <div className="space-y-3">
                  {trainingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 relative group"
                    >
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleManageTrainingParticipants(event)
                          }
                        >
                          <Contact className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setTrainingFormData({
                              location: event.location,
                              isForeign: event.isForeign,
                              startDate: event.startDate.split("T")[0],
                              endDate: event.endDate.split("T")[0],
                              concentration_id: id || "",
                              note: event.note || "",
                            });
                            setEditingTraining(event);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setTrainingToDelete(event)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2 pr-[120px]">
                          <div className="font-medium text-lg">
                            {event.location}
                          </div>
                          {(() => {
                            const status = getTrainingStatus(
                              event.startDate,
                              event.endDate
                            );
                            return (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}
                              >
                                {status.label}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            {event.isForeign ? (
                              <Plane className="h-4 w-4 text-primary/70" />
                            ) : (
                              <Home className="h-4 w-4 text-primary/70" />
                            )}
                          </div>
                          <span>
                            {event.isForeign ? "Nước ngoài" : "Trong nước"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary/70" />
                          </div>
                          <span>
                            {formatDateRange(event.startDate, event.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <Users className="h-4 w-4 text-primary/70" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formatParticipantStats(event.participantStats)}
                          </div>
                        </div>
                        {event.note && (
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <FileText className="h-4 w-4 text-primary/70" />
                            </div>
                            <span>Ghi chú: {event.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Chưa có đợt tập huấn nào
                </div>
              )}
            </CardContent>
          </Card>

          {/* Đợt thi đấu */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Thi đấu</CardTitle>
              <Dialog
                open={isCompetitionDialogOpen}
                onOpenChange={(open) => {
                  setIsCompetitionDialogOpen(open);
                  if (!open) setEditingCompetition(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Thêm thi đấu</span>
                  </Button>
                </DialogTrigger>
                <CompetitionDialog
                  isOpen={isCompetitionDialogOpen}
                  onOpenChange={(open) => {
                    setIsCompetitionDialogOpen(open);
                    if (!open) setEditingCompetition(null);
                  }}
                  onSubmit={
                    editingCompetition
                      ? handleEditCompetition
                      : handleAddCompetition
                  }
                  concentrationId={id || ""}
                  competition={editingCompetition}
                />
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              {loadingCompetitions ? (
                <div>Đang tải...</div>
              ) : (
                <div className="space-y-4">
                  {competitions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có đợt thi đấu nào
                    </div>
                  ) : (
                    competitions.map((competition) => (
                      <Card
                        key={competition.id}
                        className="shadow-sm rounded-md group hover:bg-gray-50"
                      >
                        <CardHeader className="pb-2 pt-3">
                          <CardTitle className="flex items-center justify-between text-base">
                            <div className="flex items-center gap-2">
                              <span>{competition.name}</span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full border",
                                  getTrainingStatus(
                                    competition.startDate,
                                    competition.endDate
                                  ).color
                                )}
                              >
                                {
                                  getTrainingStatus(
                                    competition.startDate,
                                    competition.endDate
                                  ).label
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full border",
                                  competition.is_confirmed
                                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                    : "text-yellow-700 bg-yellow-50 border-yellow-200"
                                )}
                              >
                                {competition.is_confirmed
                                  ? "Đã xác nhận"
                                  : "Chờ xác nhận"}
                              </span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setManagingCompetition(competition);
                                    fetchCompetitionParticipants(
                                      competition.id
                                    );
                                    setIsAddCompetitionParticipantDialogOpen(
                                      true
                                    );
                                  }}
                                >
                                  <Contact className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setEditingCompetition(competition);
                                    setIsCompetitionDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                  onClick={() =>
                                    setCompetitionToDelete(competition)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              {competition.isForeign ? (
                                <Plane className="h-4 w-4 text-primary/70" />
                              ) : (
                                <Home className="h-4 w-4 text-primary/70" />
                              )}
                            </div>
                            <span className="text-sm">
                              {competition.location}
                            </span>
                            <span className="text-xs text-gray-500">
                              (
                              {competition.isForeign
                                ? "Nước ngoài"
                                : "Trong nước"}
                              )
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <Calendar className="h-4 w-4 text-primary/70" />
                            </div>
                            <span className="text-sm">
                              {new Date(
                                competition.startDate
                              ).toLocaleDateString("vi-VN")}{" "}
                              -{" "}
                              {new Date(competition.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>

                          {competition.note && (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-primary/10">
                                <FileText className="h-4 w-4 text-primary/70" />
                              </div>
                              <span className="text-sm text-gray-600">
                                {competition.note}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <Users className="h-4 w-4 text-primary/70" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {competition.participantStats ? (
                                <>
                                  {competition.participantStats.SPECIALIST >
                                    0 && (
                                    <span className="text-xs">
                                      {competition.participantStats.SPECIALIST}{" "}
                                      CG
                                    </span>
                                  )}
                                  {competition.participantStats.COACH > 0 && (
                                    <span className="text-xs">
                                      {competition.participantStats.COACH} HLV
                                    </span>
                                  )}
                                  {competition.participantStats.ATHLETE > 0 && (
                                    <span className="text-xs">
                                      {competition.participantStats.ATHLETE} VĐV
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-xs">
                                  Chưa có người tham gia
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={!!trainingToDelete}
        onOpenChange={(open) => !open && setTrainingToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Đợt tập huấn tại "{trainingToDelete?.location}" sẽ bị xóa vĩnh
              viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full sm:w-32 bg-gray-100 hover:bg-gray-200 border-none text-gray-900">
              Không
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTraining}
              className="w-full sm:w-32 bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Có, xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddTrainingParticipantDialog
        isOpen={isAddTrainingParticipantDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setManagingTraining(null);
            setTrainingParticipantIds([]);
          }
          setIsAddTrainingParticipantDialogOpen(open);
        }}
        participants={participants}
        onSubmit={handleUpdateTrainingParticipants}
        trainingParticipantIds={trainingParticipantIds}
        participantNotes={participantNotes}
        onNoteChange={handleNoteChange}
      />

      <AlertDialog
        open={!!competitionToDelete}
        onOpenChange={(open) => !open && setCompetitionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Đợt thi đấu tại "{competitionToDelete?.location}" sẽ bị xóa vĩnh
              viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full sm:w-32 bg-gray-100 hover:bg-gray-200 border-none text-gray-900">
              Không
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompetition}
              className="w-full sm:w-32 bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Có, xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddCompetitionParticipantDialog
        isOpen={isAddCompetitionParticipantDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setManagingCompetition(null);
            setCompetitionParticipantIds([]);
            setParticipantNotes({});
            setParticipantDates({});
          }
          setIsAddCompetitionParticipantDialogOpen(open);
        }}
        participants={participants}
        onSubmit={handleUpdateCompetitionParticipants}
        competitionParticipantIds={competitionParticipantIds}
        participantNotes={participantNotes}
        onNoteChange={handleNoteChange}
        participantDates={participantDates}
        onDateChange={(id, startDate, endDate) =>
          setParticipantDates((prev) => ({
            ...prev,
            [id]: { startDate, endDate },
          }))
        }
        competition={managingCompetition!}
        onParticipantSelect={setCompetitionParticipantIds}
      />

      {/* Dialog mới */}
      <AddParticipantMultiDialog
        isOpen={isAddParticipantMultiDialogOpen}
        onOpenChange={setIsAddParticipantMultiDialogOpen}
        onSubmit={handleAddParticipantMulti}
        existingParticipants={participants}
      />
    </div>
  );
}
