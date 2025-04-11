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
import { Card } from "@/components/ui/card";
import { PermissionGate } from "@/components/PermissionGate";
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
import { HoverCard } from "@/components/cards/HoverCard";

interface Team {
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
}

interface TeamEnums {
  types: { value: string; label: string }[];
  genders: { value: string; label: string }[];
}

const ITEMS_PER_PAGE = 10;

type SortOption = {
  field: "team";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "team", direction: "asc", label: "Tên (A-Z)" },
  { field: "team", direction: "desc", label: "Tên (Z-A)" },
];

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sportId: 0,
    type: "",
    gender: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [sports, setSports] = useState<{ id: number; name: string }[]>([]);
  const [enums, setEnums] = useState<TeamEnums>({
    types: [],
    genders: [],
  });
  const [filters, setFilters] = useState({
    type: "",
  });

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
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
        setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    const fetchSports = async () => {
      try {
        const response = await fetch(`${API_URL}/sports`, {
          credentials: "include",
        });
        if (!response.ok)
          throw new Error("Không thể tải danh sách môn thể thao");

        const data = await response.json();
        if (data.success) {
          setSports(data.data);
        }
      } catch (err) {
        console.error("Fetch sports error:", err);
      }
    };

    const fetchEnums = async () => {
      try {
        const response = await fetch(`${API_URL}/teams/enums`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải dữ liệu enum");

        const data = await response.json();
        if (data.success) {
          setEnums(data.data);
        }
      } catch (err) {
        console.error("Fetch enums error:", err);
      }
    };

    fetchTeams();
    fetchSports();
    fetchEnums();
  }, []);

  // Thêm hàm resetForm
  const resetForm = () => {
    setFormData({
      sportId: 0,
      type: "",
      gender: "",
    });
    setEditingTeam(null);
  };

  // Các hàm xử lý CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể tạo đội");

      // Fetch lại toàn bộ danh sách thay vì thêm vào state
      const fetchResponse = await fetch(`${API_URL}/teams`, {
        credentials: "include",
      });
      const data = await fetchResponse.json();
      if (data.success) {
        setTeams(data.data);
      }

      setIsDialogOpen(false);
      resetForm(); // Reset form sau khi submit thành công
    } catch (err) {
      console.error("Create team error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi tạo đội");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    try {
      const response = await fetch(`${API_URL}/teams/${editingTeam.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể cập nhật đội");

      // Fetch lại toàn bộ danh sách thay vì cập nhật state
      const fetchResponse = await fetch(`${API_URL}/teams`, {
        credentials: "include",
      });
      const data = await fetchResponse.json();
      if (data.success) {
        setTeams(data.data);
      }

      setIsDialogOpen(false);
      resetForm(); // Reset form sau khi edit thành công
    } catch (err) {
      console.error("Update team error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi cập nhật đội");
    }
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;

    try {
      const response = await fetch(`${API_URL}/teams/${teamToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể xóa đội");

      setTeams(teams.filter((team) => team.id !== teamToDelete.id));
      setTeamToDelete(null);
    } catch (err) {
      console.error("Delete team error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi xóa đội");
    }
  };

  // Xử lý UI
  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Danh mục đội</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sắp xếp
                </Button>
                <Button disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm đội
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            </div>

            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const filteredTeams = teams.filter(
    (team) =>
      (filters.type ? team.rawData.type === filters.type : true) &&
      (team.sport?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ??
        false)
  );

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);

  const sortedAndPaginatedTeams = [...filteredTeams]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      return a.sport.localeCompare(b.sport) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Danh mục đội</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {currentSort.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.direction}
                      onClick={() => setCurrentSort(option)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <PermissionGate permission="CREATE_TAG">
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                      // Khi đóng dialog
                      resetForm();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm đội
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTeam ? "Chỉnh sửa đội" : "Thêm đội mới"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={editingTeam ? handleEdit : handleSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="sportId">Môn thể thao</Label>
                        <select
                          id="sportId"
                          value={formData.sportId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sportId: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Chọn môn thể thao</option>
                          {sports.map((sport) => (
                            <option key={sport.id} value={sport.id}>
                              {sport.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Đội</Label>
                        <select
                          id="type"
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Chọn đội</option>
                          {enums.types.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gender: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Chọn giới tính</option>
                          {enums.genders.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button type="submit" className="w-full">
                        {editingTeam ? "Cập nhật" : "Thêm mới"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </PermissionGate>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm đội..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-64">
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Tất cả đội</option>
                {enums.types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Hiển thị {sortedAndPaginatedTeams.length} / {filteredTeams.length}{" "}
              đội
              {searchTerm || filters.type ? " (đã lọc)" : ""}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {error ? (
              <div className="col-span-full text-center py-10">
                <p className="text-red-500">{error}</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Chưa có đội nào trong danh sách</p>
              </div>
            ) : (
              sortedAndPaginatedTeams.map((team) => (
                <HoverCard
                  key={team.id}
                  id={team.id}
                  title={`Đội ${team.type} ${team.sport} ${team.gender}`}
                  onEdit={() => {
                    setEditingTeam(team);
                    setFormData({
                      sportId: team.rawData.sportId,
                      type: team.rawData.type,
                      gender: team.rawData.gender,
                    });
                    setIsDialogOpen(true);
                  }}
                  onDelete={() => setTeamToDelete(team)}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <AlertDialog
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Đội tuyển {teamToDelete?.type} {teamToDelete?.sport}{" "}
              {teamToDelete?.gender} sẽ bị xóa vĩnh viễn và không thể khôi phục.
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
