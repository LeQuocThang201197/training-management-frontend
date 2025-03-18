import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { API_URL } from "@/config/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { ConcentrationCard } from "@/components/cards/ConcentrationCard";
import { Concentration } from "@/types/concentration";
import { PermissionGate } from "@/components/PermissionGate";

interface Team {
  id: number;
  sport: string;
  type: string;
  room: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  rawData: {
    sportId: number;
    type: string;
    room: string;
    gender: string;
  };
}

interface ConcentrationFormData {
  team_id: number;
  related_year: number;
  sequence_number: number;
  location: string;
  note: string;
  start_date: string;
  end_date: string;
}

const ITEMS_PER_PAGE = 21;

type SortOption = {
  field: "name" | "date";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "name", direction: "asc", label: "Tên (A-Z)" },
  { field: "name", direction: "desc", label: "Tên (Z-A)" },
  { field: "date", direction: "desc", label: "Ngày bắt đầu (Mới nhất)" },
  { field: "date", direction: "asc", label: "Ngày bắt đầu (Cũ nhất)" },
];

export function ConcentrationPage() {
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ConcentrationFormData>({
    team_id: 0,
    related_year: new Date().getFullYear(),
    sequence_number: 1,
    location: "",
    note: "",
    start_date: "",
    end_date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teamTypeFilter, setTeamTypeFilter] = useState<string>("all");

  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "Tuyển", label: "Đội tuyển" },
    { value: "Trẻ", label: "Đội trẻ" },
    { value: "Khuyết tật", label: "Đội người khuyết tật" },
  ];

  useEffect(() => {
    const fetchConcentrations = async () => {
      try {
        const response = await fetch(`${API_URL}/concentrations`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách tập trung");

        const data = await response.json();
        if (data.success) {
          setConcentrations(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchConcentrations();
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
      const dataToSubmit = {
        teamId: formData.team_id,
        location: formData.location,
        related_year: formData.related_year,
        sequence_number: formData.sequence_number,
        startDate: formData.start_date,
        endDate: formData.end_date,
        note: formData.note,
      };

      const response = await fetch(`${API_URL}/concentrations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) throw new Error("Không thể tạo đợt tập trung");

      const data = await response.json();
      if (data.success) {
        setConcentrations((prev) => [...prev, data.data]);
        setIsDialogOpen(false);
        setFormData({
          team_id: 0,
          related_year: new Date().getFullYear(),
          sequence_number: 1,
          location: "",
          note: "",
          start_date: "",
          end_date: "",
        });
      }
    } catch (err) {
      console.error("Create concentration error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi tạo đợt tập trung");
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

  const filteredConcentrations = concentrations.filter((concentration) => {
    const matchesSearch = concentration.team.sport
      ? concentration.team.sport
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
      : false;

    const matchesType =
      teamTypeFilter === "all" || concentration.team.type === teamTypeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredConcentrations.length / ITEMS_PER_PAGE);

  const sortedAndPaginatedConcentrations = [...filteredConcentrations]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      if (currentSort.field === "date") {
        return (
          (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) *
          modifier
        );
      }
      return a.team.sport.localeCompare(b.team.sport) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filteredTeams = teams.filter(
    (team) =>
      (team.type
        ? team.type.toLowerCase().includes(teamSearchTerm.toLowerCase())
        : false) ||
      (team.sport
        ? team.sport.toLowerCase().includes(teamSearchTerm.toLowerCase())
        : false)
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tập trung</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {
                  filterOptions.find(
                    (option) => option.value === teamTypeFilter
                  )?.label
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTeamTypeFilter(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          <PermissionGate permission="CREATE_CONCENTRATION">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm đợt tập trung
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm đợt tập trung mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div className="flex gap-4">
                    <div className="space-y-2 w-24">
                      <Label htmlFor="sequence_number">Đợt</Label>
                      <Input
                        id="sequence_number"
                        type="number"
                        min={1}
                        value={formData.sequence_number}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sequence_number: parseInt(e.target.value) || 1,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      <Label htmlFor="related_year">Năm</Label>
                      <Input
                        id="related_year"
                        type="number"
                        value={formData.related_year}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            related_year: parseInt(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Ngày bắt đầu</Label>
                      <input
                        type="date"
                        id="start_date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">Ngày kết thúc</Label>
                      <input
                        type="date"
                        id="end_date"
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            end_date: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <PermissionGate permission="CREATE_CONCENTRATION">
                      <Button type="submit">Thêm mới</Button>
                    </PermissionGate>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </PermissionGate>
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
        {sortedAndPaginatedConcentrations.map((concentration) => (
          <ConcentrationCard
            key={concentration.id}
            concentration={concentration}
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
    </div>
  );
}
