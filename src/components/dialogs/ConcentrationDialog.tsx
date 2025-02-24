import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Team {
  id: number;
  sport: string;
  type: string;
  gender: string;
}

interface CreateConcentrationFormData {
  teamId: number;
  related_year: number;
  sequence_number: number;
  location: string;
  startDate: string;
  endDate: string;
}

interface CreateConcentrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateConcentrationFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateConcentrationFormData>
  >;
  onSubmit: (e: React.FormEvent) => void;
  teams: Team[];
  teamSearchTerm: string;
  setTeamSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  isTeamDropdownOpen: boolean;
  setIsTeamDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConcentrationDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  teams,
  teamSearchTerm,
  setTeamSearchTerm,
  isTeamDropdownOpen,
  setIsTeamDropdownOpen,
  mode = "create",
}: CreateConcentrationDialogProps & { mode?: "create" | "edit" }) {
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
        <form onSubmit={onSubmit} className="space-y-4">
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
