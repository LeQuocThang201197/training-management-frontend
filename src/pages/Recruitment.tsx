import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard } from "@/components/HoverCard";
import { DatePicker } from "@/components/ui/date-picker";

interface Recruitment {
  id: number;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  team_id: number;
}

interface Team {
  id: number;
  sport: string;
  type: string;
  room: string;
  gender: string;
}

interface RecruitmentFormData {
  team_id: number;
  year: number;
  location: string;
  note: string;
  start_date: string;
  end_date: string;
}

const ITEMS_PER_PAGE = 21;

type SortOption = {
  field: "name" | "year";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "name", direction: "asc", label: "Tên (A-Z)" },
  { field: "name", direction: "desc", label: "Tên (Z-A)" },
  { field: "year", direction: "desc", label: "Năm (Mới nhất)" },
  { field: "year", direction: "asc", label: "Năm (Cũ nhất)" },
];

export function RecruitmentPage() {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<RecruitmentFormData>({
    team_id: 0,
    year: new Date().getFullYear(),
    location: "",
    note: "",
    start_date: "",
    end_date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecruitment, setEditingRecruitment] =
    useState<Recruitment | null>(null);
  const [recruitmentToDelete, setRecruitmentToDelete] =
    useState<Recruitment | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const response = await fetch(`${API_URL}/recruitments`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách tập trung");

        const data = await response.json();
        if (data.success) {
          setRecruitments(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitments();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/recruitments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể tạo đợt tập trung");

      const data = await response.json();
      if (data.success) {
        setRecruitments((prev) => [...prev, data.data]);
        setIsDialogOpen(false);
        setFormData({
          team_id: 0,
          year: new Date().getFullYear(),
          location: "",
          note: "",
          start_date: "",
          end_date: "",
        });
      }
    } catch (err) {
      console.error("Create recruitment error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi tạo đợt tập trung");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecruitment) return;

    try {
      const response = await fetch(
        `${API_URL}/recruitments/${editingRecruitment.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật đợt tập trung");

      const data = await response.json();
      if (data.success) {
        setRecruitments((prev) =>
          prev.map((recruitment) =>
            recruitment.id === editingRecruitment.id ? data.data : recruitment
          )
        );
        setIsDialogOpen(false);
        setEditingRecruitment(null);
      }
    } catch (err) {
      console.error("Update recruitment error:", err);
      alert(
        err instanceof Error ? err.message : "Lỗi khi cập nhật đợt tập trung"
      );
    }
  };

  const handleDelete = async () => {
    if (!recruitmentToDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/recruitments/${recruitmentToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa đợt tập trung");

      setRecruitments((prev) =>
        prev.filter((recruitment) => recruitment.id !== recruitmentToDelete.id)
      );
      setRecruitmentToDelete(null);
    } catch (err) {
      console.error("Delete recruitment error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi xóa đợt tập trung");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const filteredRecruitments = recruitments.filter((recruitment) =>
    recruitment.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredRecruitments.length / ITEMS_PER_PAGE);

  const sortedAndPaginatedRecruitments = [...filteredRecruitments]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      if (currentSort.field === "year") {
        return (a.year - b.year) * modifier;
      }
      return a.name.localeCompare(b.name) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filteredTeams = teams.filter(
    (team) =>
      team.type.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
      team.sport.toLowerCase().includes(teamSearchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tập trung</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {currentSort.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={`${option.field}-${option.direction}`}
                  onClick={() => setCurrentSort(option)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm đợt tập trung
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRecruitment
                    ? "Chỉnh sửa đợt tập trung"
                    : "Thêm đợt tập trung mới"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={editingRecruitment ? handleEdit : handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="team">Chọn đội</Label>
                  <div className="relative">
                    <Input
                      id="team"
                      value={teamSearchTerm}
                      onChange={(e) => {
                        setTeamSearchTerm(e.target.value);
                        setIsTeamDropdownOpen(true);
                      }}
                      onFocus={() => setIsTeamDropdownOpen(true)}
                      placeholder="Tìm kiếm đội..."
                      required
                    />
                    {isTeamDropdownOpen && filteredTeams.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                        {filteredTeams.map((team) => (
                          <div
                            key={team.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                team_id: team.id,
                              }));
                              setTeamSearchTerm(
                                `${team.type} - ${team.sport} (${team.gender})`
                              );
                              setIsTeamDropdownOpen(false);
                            }}
                          >
                            {team.type} - {team.sport} ({team.gender})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Năm</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Nhập địa điểm tập trung"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    id="note"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Ngày bắt đầu</Label>
                    <DatePicker
                      value={
                        formData.start_date
                          ? new Date(formData.start_date)
                          : null
                      }
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          start_date: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        }))
                      }
                      placeholder="dd/mm/yyyy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">Ngày kết thúc</Label>
                    <DatePicker
                      value={
                        formData.end_date ? new Date(formData.end_date) : null
                      }
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          end_date: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        }))
                      }
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    {editingRecruitment ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm đợt tập trung..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndPaginatedRecruitments.map((recruitment) => (
          <HoverCard
            key={recruitment.id}
            id={recruitment.id}
            title={`${
              teams.find((t) => t.id === recruitment.team_id)?.type || ""
            } - ${
              teams.find((t) => t.id === recruitment.team_id)?.sport || ""
            }`}
            subtitle={`${new Date(recruitment.start_date).toLocaleDateString(
              "vi-VN"
            )} - ${new Date(recruitment.end_date).toLocaleDateString("vi-VN")}`}
            status={
              recruitment.status === "published" ? "Đã phát hành" : "Nháp"
            }
            onEdit={() => {
              setEditingRecruitment(recruitment);
              const selectedTeam = teams.find(
                (t) => t.id === recruitment.team_id
              );
              setTeamSearchTerm(
                selectedTeam
                  ? `${selectedTeam.type} - ${selectedTeam.sport} (${selectedTeam.gender})`
                  : ""
              );
              setFormData({
                team_id: recruitment.team_id,
                year: recruitment.year,
                location: "",
                note: "",
                start_date: recruitment.start_date,
                end_date: recruitment.end_date,
              });
              setIsDialogOpen(true);
            }}
            onDelete={() => setRecruitmentToDelete(recruitment)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!recruitmentToDelete}
        onOpenChange={(open) => !open && setRecruitmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Đợt tập trung "{recruitmentToDelete?.name}" sẽ bị xóa vĩnh viễn và
              không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-4">
            <AlertDialogCancel className="w-full sm:w-32 bg-gray-100 hover:bg-gray-200 border-none text-gray-900">
              Không
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-32 bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Có, xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
