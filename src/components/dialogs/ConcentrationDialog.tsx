import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Team } from "@/types/index";

interface CreateConcentrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: {
    teamId: number;
    location: string;
    related_year: number;
    sequence_number: number;
    startDate: string;
    endDate: string;
    note?: string;
    room: string;
    filePath?: string;
  }) => Promise<void>;
  mode?: "create" | "edit";
}

const initialFormData = {
  team_id: 0,
  related_year: new Date().getFullYear(),
  sequence_number: 1,
  location: "",
  startDate: "",
  endDate: "",
  room: "",
  note: "",
  filePath: "",
};

export function ConcentrationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  mode = "create",
}: CreateConcentrationDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rooms, setRooms] = useState<{ value: string; label: string }[]>([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  // Reset form khi dialog đóng
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setTeamSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Fetch teams
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

      // Fetch rooms
      const fetchRooms = async () => {
        try {
          const response = await fetch(`${API_URL}/concentrations/rooms`, {
            credentials: "include",
          });
          if (!response.ok) throw new Error("Không thể tải danh sách phòng");
          const data = await response.json();
          if (data.success) {
            setRooms(data.data);
          }
        } catch (err) {
          console.error("Fetch rooms error:", err);
        }
      };

      fetchTeams();
      fetchRooms();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuyển đổi dữ liệu trước khi gửi
    const submitData = {
      teamId: formData.team_id,
      location: formData.location,
      related_year: formData.related_year,
      sequence_number: formData.sequence_number,
      startDate: formData.startDate,
      endDate: formData.endDate,
      note: formData.note,
      room: formData.room,
      filePath: formData.filePath || undefined,
    };

    await onSubmit(submitData);

    // Reset form sau khi submit thành công
    if (mode === "create") {
      setFormData(initialFormData);
      setTeamSearchTerm("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Thêm đợt tập trung mới"
              : "Chỉnh sửa đợt tập trung"}
          </DialogTitle>
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
                disabled={mode === "edit"}
              />
              {isTeamDropdownOpen && teams.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                  {teams
                    .filter((team) =>
                      `${team.type} - ${team.sport} (${team.gender})`
                        .toLowerCase()
                        .includes(teamSearchTerm.toLowerCase())
                    )
                    .map((team) => (
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
            <Label htmlFor="room">Phòng quản lý</Label>
            <select
              id="room"
              value={formData.room}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  room: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Chọn phòng quản lý</option>
              {rooms.map((room) => (
                <option key={room.value} value={room.value}>
                  {room.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Ngày bắt đầu</Label>
              <input
                type="date"
                id="start_date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
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
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
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
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {mode === "create" ? "Thêm mới" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
