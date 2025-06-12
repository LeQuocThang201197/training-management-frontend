import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Check,
  Mars,
  Venus,
  Info,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_URL } from "@/config/api";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Person, LatestParticipation } from "@/types/personnel";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiResponse {
  success: boolean;
  data: Person[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTeamStyle = (participation?: LatestParticipation) => {
  if (!participation) return "text-gray-600";

  const today = new Date();
  const endDate = new Date(participation.concentration.endDate);
  endDate.setHours(23, 59, 59, 999);

  // Nếu đã kết thúc, trả về màu xám
  if (today > endDate) return "text-gray-600";

  // Nếu đang diễn ra, trả về màu theo loại đội
  switch (participation.team.type) {
    case "Trẻ":
      return "text-emerald-700";
    case "Người khuyết tật":
      return "text-purple-700";
    case "Tuyển":
      return "text-red-700";
    default:
      return "text-primary";
  }
};

const PersonTableRow = ({
  person,
  onDelete,
  formatDate,
}: {
  person: Person;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const participation = person.latest_participation;
  const teamStyle = getTeamStyle(participation);

  const copyToClipboard = (
    text: string | null,
    type: "CCCD" | "BHXH" | "SĐT" | "Email"
  ) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: `Đã sao chép ${
            type === "CCCD"
              ? "CCCD/CMND"
              : type === "BHXH"
              ? "Bảo hiểm xã hội"
              : type === "SĐT"
              ? "SĐT"
              : "Email"
          }: ${text}`,
          duration: 2000, // Will auto-dismiss after 2 seconds
          className: "bg-green-50 text-green-900 border-green-200",
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          variant: "destructive",
          description: "Không thể sao chép, vui lòng thử lại",
          duration: 2000,
        });
      });
  };

  return (
    <TableRow key={person.id}>
      <TableCell className="font-medium">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="block w-full truncate text-left">
              <button
                onClick={() => navigate(`/management/personnel/${person.id}`)}
                className="flex items-center gap-2 hover:text-primary hover:underline w-full text-left"
              >
                <span className="truncate">{person.name}</span>
                {person.gender === "Nam" ? (
                  <Mars className="h-4 w-4 text-blue-500" />
                ) : (
                  <Venus className="h-4 w-4 text-pink-500" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nhấn để xem chi tiết</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="inline-flex">
              {person.identity_number ? (
                <Check
                  className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700"
                  onClick={() =>
                    copyToClipboard(person.identity_number, "CCCD")
                  }
                />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {person.identity_number ? (
                <div className="space-y-1">
                  <p>{person.identity_number}</p>
                  {person.identity_date && (
                    <p className="text-sm text-gray-500">
                      Ngày cấp: {formatDate(person.identity_date)}
                    </p>
                  )}
                </div>
              ) : (
                <p>Chưa cập nhật</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="inline-flex">
              {person.social_insurance ? (
                <Check
                  className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700"
                  onClick={() =>
                    copyToClipboard(person.social_insurance, "BHXH")
                  }
                />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{person.social_insurance || "Chưa cập nhật"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="inline-flex">
              {person.phone ? (
                <Check
                  className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700"
                  onClick={() => copyToClipboard(person.phone, "SĐT")}
                />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{person.phone || "Chưa cập nhật"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="inline-flex">
              {person.email ? (
                <Check
                  className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700"
                  onClick={() => copyToClipboard(person.email, "Email")}
                />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{person.email || "Chưa cập nhật"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        {formatDate(person.birthday)}
      </TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="inline-flex">
              {participation?.concentration ? (
                <a
                  href={`/management/concentrations/${participation.concentration.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-col items-center hover:underline",
                    teamStyle
                  )}
                >
                  <span className="text-sm font-medium">
                    {`${participation.team.type} ${participation.sport} ${
                      participation.team.gender === "Hỗn hợp"
                        ? ""
                        : participation.team.gender
                    }`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(participation.concentration.endDate) > new Date()
                      ? "(Đang tập trung)"
                      : "(Gần nhất)"}
                  </span>
                </a>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {participation ? (
                <div>
                  <p>Vai trò: {participation.role}</p>
                  <p>Địa điểm: {participation.concentration.location}</p>
                  <p>
                    {formatDate(participation.concentration.startDate)}
                    {" - "}
                    {formatDate(participation.concentration.endDate)}
                  </p>
                </div>
              ) : (
                <p>Chưa tham gia đội nào</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onDelete(person.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "birthday">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
  });
  const navigate = useNavigate();

  const fetchPersonnel = useCallback(
    async (page: number, search?: string) => {
      try {
        setLoading(true);
        const sortQuery = `sortBy=${sortField}&order=${sortDirection}`;
        const searchQuery = search ? `&q=${encodeURIComponent(search)}` : "";

        const url = `${API_URL}/persons?page=${page}&limit=${pagination.limit}&${sortQuery}${searchQuery}`;

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Không thể tải danh sách nhân sự");

        const data: ApiResponse = await response.json();
        if (data.success) {
          setPersonnel(data.data);
          setTotalPages(data.pagination.totalPages);
          setPagination({
            total: data.pagination.total,
            limit: data.pagination.limit,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [sortField, sortDirection, pagination.limit]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchPersonnel(currentPage, searchTerm);
      } else {
        fetchPersonnel(currentPage);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage, fetchPersonnel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (personId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/persons/${personId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể xóa nhân sự");

      const data = await response.json();
      if (data.success) {
        if (searchTerm) {
          setPersonnel((prev) => prev.filter((p) => p.id !== personId));
        } else {
          setPersonnel((prev) => prev.filter((p) => p.id !== personId));
        }
      }
    } catch (err) {
      console.error("Delete person error:", err);
    }
  };

  const toggleSort = (field: "name" | "birthday") => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      if (searchTerm) {
        fetchPersonnel(1, searchTerm);
      } else {
        fetchPersonnel(currentPage);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
      if (searchTerm) {
        fetchPersonnel(1, searchTerm);
      } else {
        fetchPersonnel(currentPage);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý nhân sự</h1>
      </div>

      {/* Thông báo hướng dẫn */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-center justify-between">
            <span>
              Để thêm nhân sự mới, vui lòng truy cập vào{" "}
              <strong>Đợt tập trung</strong> cụ thể và sử dụng tính năng{" "}
              <strong>"Thêm thành viên"</strong>.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/management/concentrations")}
              className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Đến trang Tập trung
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-3 mb-6">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[500px]"
          clearable
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="w-full">
                        <div
                          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => toggleSort("name")}
                        >
                          Họ và tên
                          <ArrowUpDown
                            className={cn(
                              "h-4 w-4",
                              sortField === "name"
                                ? "opacity-100"
                                : "opacity-40",
                              sortDirection === "desc" && "transform rotate-180"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nhấn để sắp xếp theo tên</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center w-[10%]">CCCD/CMND</TableHead>
                <TableHead className="text-center w-[10%]">
                  Bảo hiểm XH
                </TableHead>
                <TableHead className="text-center w-[10%]">SĐT</TableHead>
                <TableHead className="text-center w-[10%]">Email</TableHead>
                <TableHead className="text-center w-[12%]">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <div
                          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => toggleSort("birthday")}
                        >
                          Ngày sinh
                          <ArrowUpDown
                            className={cn(
                              "h-4 w-4",
                              sortField === "birthday"
                                ? "opacity-100"
                                : "opacity-40",
                              sortDirection === "desc" && "transform rotate-180"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nhấn để sắp xếp theo ngày sinh</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center w-[10%]">Đội</TableHead>
                <TableHead className="text-right w-[10%]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnel.map((person) => (
                <PersonTableRow
                  key={person.id}
                  person={person}
                  onDelete={handleDelete}
                  formatDate={formatDate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
          total={pagination.total}
          itemsPerPage={personnel.length}
          itemName="nhân sự"
        />
      </div>
    </div>
  );
}
