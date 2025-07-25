import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Users,
  UserPlus,
  Copy,
  Filter,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { API_URL } from "@/config/api";
import { PersonFormData } from "@/types/personnel";
import { Role, Organization, Person, Participant } from "@/types/participant";
import { Concentration } from "@/types/concentration";
import { ConcentrationFilter } from "@/components/ConcentrationFilter";
import { useConcentrationFilter } from "@/hooks/useConcentrationFilter";
import { ParticipationForm } from "@/components/ParticipationForm";
import { DuplicateInfo } from "./DuplicatePersonDialog";
import { CONCENTRATION_FILTER_DEFAULTS } from "@/types/concentrationFilter";

interface AddParticipantMultiDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: unknown) => void;
  existingParticipants?: { person: { id: number } }[];
  onDuplicateFound?: (duplicateInfo: DuplicateInfo) => void;
}

export function AddParticipantMultiDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  existingParticipants = [],
  onDuplicateFound,
}: AddParticipantMultiDialogProps) {
  const [activeTab, setActiveTab] = useState("from-concentration");

  // State cho tab "Thêm nhân sự mới"
  const [newPersonFormData, setNewPersonFormData] = useState<PersonFormData>({
    name: "",
    identity_number: null,
    identity_date: null,
    identity_place: null,
    social_insurance: null,
    birthday: "",
    gender: "",
    phone: null,
    email: null,
  });

  const [participationFormData, setParticipationFormData] = useState({
    roleId: "",
    organizationId: "",
    note: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // State cho tab "Từ danh sách"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [fromListFormData, setFromListFormData] = useState({
    roleId: "",
    organizationId: "",
    note: "",
  });
  const [fromListOrgDropdownOpen, setFromListOrgDropdownOpen] = useState(false);

  // State cho tab "Từ đợt tập trung khác"
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [selectedConcentrationId, setSelectedConcentrationId] = useState("");
  const [concentrationParticipants, setConcentrationParticipants] = useState<
    Participant[]
  >([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    number[]
  >([]);

  // Use concentration filter hook
  const {
    filters: concentrationFilters,
    setFilters: setConcentrationFilters,
    sports,
    loadingSports,
    page: concentrationPage,
    setPage: setConcentrationPage,
  } = useConcentrationFilter({
    defaultStatuses: CONCENTRATION_FILTER_DEFAULTS.statuses,
  });

  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [loadingConcentrations, setLoadingConcentrations] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [concentrationPagination, setConcentrationPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  // Fetch roles và organizations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, orgsResponse] = await Promise.all([
          fetch(`${API_URL}/person-roles`, { credentials: "include" }),
          fetch(`${API_URL}/organizations/all`, { credentials: "include" }),
        ]);

        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json();
          if (rolesData.success) setRoles(rolesData.data);
        }

        if (orgsResponse.ok) {
          const orgsData = await orgsResponse.json();
          if (orgsData.success) setOrganizations(orgsData.data);
        }
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!isOpen) {
      setNewPersonFormData({
        name: "",
        identity_number: null,
        identity_date: null,
        identity_place: null,
        social_insurance: null,
        birthday: "",
        gender: "",
        phone: null,
        email: null,
      });
      setParticipationFormData({
        roleId: "",
        organizationId: "",
        note: "",
      });
      setSearchTerm("");
      setSearchResults([]);
      setSelectedPersonId("");
      setFromListFormData({
        roleId: "",
        organizationId: "",
        note: "",
      });
      setFromListOrgDropdownOpen(false);
      setSelectedConcentrationId("");
      setConcentrationParticipants([]);
      setSelectedParticipantIds([]);
      setRoleFilter("all-roles");
      setErrors({});
      setActiveTab("from-concentration");
    }
  }, [isOpen]);

  // Fetch concentrations với API mới
  useEffect(() => {
    const fetchConcentrations = async () => {
      if (!isOpen) return;

      try {
        setLoadingConcentrations(true);

        // Build query parameters
        const params = new URLSearchParams();

        // Sport filter (multiple values)
        if (concentrationFilters.sportIds.length > 0) {
          params.append("sportId", concentrationFilters.sportIds.join(","));
        }

        // Year filter
        if (concentrationFilters.year) {
          params.append("year", concentrationFilters.year);
        }

        // Status filter (multiple values)
        if (concentrationFilters.statuses.length > 0) {
          params.append("status", concentrationFilters.statuses.join(","));
        }

        // Team type filter (multiple values)
        if (concentrationFilters.teamTypes.length > 0) {
          params.append("teamType", concentrationFilters.teamTypes.join(","));
        }

        // Sort options
        params.append("sortBy", concentrationFilters.sortBy);
        params.append("sortOrder", concentrationFilters.sortOrder);

        // Pagination
        params.append("page", concentrationPage.toString());
        params.append("limit", "10");

        const response = await fetch(`${API_URL}/concentrations?${params}`, {
          credentials: "include",
        });

        if (!response.ok)
          throw new Error("Không thể tải danh sách đợt tập trung");

        const data = await response.json();
        if (data.success) {
          setConcentrations(data.data);
          setConcentrationPagination({
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          });
        }
      } catch (err) {
        console.error("Fetch concentrations error:", err);
      } finally {
        setLoadingConcentrations(false);
      }
    };

    // Debounce API call
    const timeoutId = setTimeout(fetchConcentrations, 300);
    return () => clearTimeout(timeoutId);
  }, [
    isOpen,
    concentrationFilters.sportIds,
    concentrationFilters.teamTypes,
    concentrationFilters.statuses,
    concentrationFilters.year,
    concentrationFilters.sortBy,
    concentrationFilters.sortOrder,
    concentrationPage,
  ]);

  // Reset page when filters change (handled by hook)
  useEffect(() => {
    if (isOpen) {
      setConcentrationPage(1);
    }
  }, [
    isOpen,
    concentrationFilters.sportIds,
    concentrationFilters.teamTypes,
    concentrationFilters.statuses,
    concentrationFilters.year,
    concentrationFilters.sortBy,
    concentrationFilters.sortOrder,
    setConcentrationPage,
  ]);

  // Fetch participants khi chọn concentration
  useEffect(() => {
    const fetchConcentrationParticipants = async () => {
      if (!selectedConcentrationId) {
        setConcentrationParticipants([]);
        return;
      }

      try {
        setLoadingParticipants(true);
        const response = await fetch(
          `${API_URL}/concentrations/${selectedConcentrationId}/participants`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Không thể tải danh sách thành viên");

        const data = await response.json();
        if (data.success) {
          setConcentrationParticipants(data.data);
        }
      } catch (err) {
        console.error("Fetch concentration participants error:", err);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchConcentrationParticipants();
  }, [selectedConcentrationId]);

  // Không cần client-side filtering nữa vì đã có server-side search
  const filteredConcentrations = concentrations;

  // Search people cho tab "Từ danh sách"
  useEffect(() => {
    const searchPeople = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/persons?q=${encodeURIComponent(searchTerm)}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Không thể tìm kiếm");

        const data = await response.json();
        if (data.success) {
          setSearchResults(data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPeople, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        fromListOrgDropdownOpen &&
        !target.closest(".organization-dropdown")
      ) {
        setFromListOrgDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fromListOrgDropdownOpen]);

  // Kiểm tra người đã tồn tại trong đợt tập trung
  const isPersonInConcentration = (personId: number) => {
    return existingParticipants.some((p) => p.person.id === personId);
  };

  // Validate form
  const validateNewPersonForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newPersonFormData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }
    if (!newPersonFormData.birthday) {
      newErrors.birthday = "Vui lòng nhập ngày sinh";
    }
    if (!newPersonFormData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }
    if (!participationFormData.roleId) {
      newErrors.roleId = "Vui lòng chọn vai trò";
    }
    if (!participationFormData.organizationId) {
      newErrors.organizationId = "Vui lòng chọn đơn vị";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate form cho tab "Từ danh sách"
  const validateFromListForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedPersonId) {
      newErrors.personId = "Vui lòng chọn người tham gia";
    }
    if (!fromListFormData.roleId) {
      newErrors.roleId = "Vui lòng chọn vai trò";
    }
    if (!fromListFormData.organizationId) {
      newErrors.organizationId = "Vui lòng chọn đơn vị";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit cho tab "Thêm nhân sự mới"
  const handleSubmitNewPerson = async () => {
    if (!validateNewPersonForm()) return;

    setLoading(true);
    try {
      // Tạo nhân sự mới trước
      const personResponse = await fetch(`${API_URL}/persons`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPersonFormData),
      });

      const personData = await personResponse.json();

      if (personData.success) {
        // Gọi onSubmit với dữ liệu để thêm vào đợt tập trung
        onSubmit?.({
          type: "new-person",
          personId: personData.data.id.toString(),
          roleId: participationFormData.roleId,
          organizationId: participationFormData.organizationId,
          note: participationFormData.note,
        });
      } else {
        // Xử lý trường hợp trùng lặp
        if (personData.duplicate_info) {
          onDuplicateFound?.(personData.duplicate_info);
        } else {
          // Lỗi khác
          alert(personData.message || "Có lỗi xảy ra khi tạo nhân sự mới");
        }
      }
    } catch (err) {
      console.error("Create new person error:", err);
      alert("Có lỗi xảy ra khi tạo nhân sự mới");
    } finally {
      setLoading(false);
    }
  };

  // Handle submit cho tab "Từ danh sách"
  const handleSubmitFromList = () => {
    if (!validateFromListForm()) return;

    onSubmit?.({
      type: "from-list",
      personId: selectedPersonId,
      roleId: fromListFormData.roleId,
      organizationId: fromListFormData.organizationId,
      note: fromListFormData.note,
    });
  };

  // Handle submit cho tab "Từ đợt tập trung khác"
  const handleSubmitFromConcentration = () => {
    if (selectedParticipantIds.length === 0) {
      alert("Vui lòng chọn ít nhất một thành viên");
      return;
    }

    onSubmit?.({
      type: "from-concentration",
      selectedParticipantIds,
      sourceConcentrationId: selectedConcentrationId,
    });
  };

  // Handle submit chung
  const handleSubmit = () => {
    if (activeTab === "new-person") {
      handleSubmitNewPerson();
    } else if (activeTab === "from-list") {
      handleSubmitFromList();
    } else if (activeTab === "from-concentration") {
      handleSubmitFromConcentration();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thêm thành viên
          </DialogTitle>
          <DialogDescription>
            Chọn cách thức thêm thành viên vào đợt tập trung
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 min-h-0"
        >
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger
              value="from-concentration"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Từ đợt tập trung khác
            </TabsTrigger>
            <TabsTrigger value="from-list" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Từ danh sách
            </TabsTrigger>
            <TabsTrigger value="new-person" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Thêm nhân sự mới
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Từ đợt tập trung khác */}
          <TabsContent
            value="from-concentration"
            className="space-y-4 flex-1 overflow-y-auto"
          >
            <div className="space-y-4">
              {/* Filters và sort cho đợt tập trung */}
              <div className="space-y-4">
                {/* Concentration Filter */}
                <ConcentrationFilter
                  filters={concentrationFilters}
                  onFiltersChange={setConcentrationFilters}
                  sports={sports}
                  loadingSports={loadingSports}
                  compact
                />

                {/* Danh sách đợt tập trung */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      Chọn đợt tập trung (Trang {concentrationPage}/
                      {concentrationPagination.totalPages} -{" "}
                      {concentrationPagination.total} đợt)
                    </Label>
                  </div>
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {loadingConcentrations ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredConcentrations.length > 0 ? (
                      filteredConcentrations.map((concentration) => {
                        const getStatus = () => {
                          const now = new Date();
                          const start = new Date(concentration.startDate);
                          const end = new Date(concentration.endDate);
                          end.setHours(23, 59, 59, 999);

                          if (now < start)
                            return {
                              label: "Chưa diễn ra",
                              variant: "outline" as const,
                            };
                          if (now > end)
                            return {
                              label: "Đã kết thúc",
                              variant: "secondary" as const,
                            };
                          return {
                            label: "Đang diễn ra",
                            variant: "default" as const,
                          };
                        };

                        const status = getStatus();
                        const isSelected =
                          selectedConcentrationId ===
                          concentration.id.toString();

                        return (
                          <div
                            key={concentration.id}
                            className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                              isSelected ? "bg-blue-50 border-blue-200" : ""
                            }`}
                            onClick={() =>
                              setSelectedConcentrationId(
                                concentration.id.toString()
                              )
                            }
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">
                                    Đội {concentration.team.type.toLowerCase()}{" "}
                                    {concentration.team.sport}{" "}
                                    {concentration.team.gender !==
                                    "Cả nam và nữ"
                                      ? concentration.team.gender.toLowerCase()
                                      : ""}{" "}
                                    đợt {concentration.sequence_number}{" "}
                                    {concentration.related_year}
                                  </span>
                                  <Badge
                                    variant={status.variant}
                                    className="text-xs"
                                  >
                                    {status.label}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  📍 {concentration.location}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(
                                    concentration.startDate
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  -{" "}
                                  {new Date(
                                    concentration.endDate
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {concentrationFilters.sportIds.length > 0 ||
                        concentrationFilters.year !==
                          new Date().getFullYear().toString() ||
                        concentrationFilters.statuses.length > 0 ||
                        concentrationFilters.teamTypes.length > 0
                          ? "Không tìm thấy đợt tập trung nào phù hợp"
                          : "Không có đợt tập trung nào"}
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {concentrationPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between p-3 border-t">
                      <div className="text-sm text-gray-600">
                        Hiển thị {Math.min(10, concentrationPagination.total)} /{" "}
                        {concentrationPagination.total} đợt
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setConcentrationPage((p) => Math.max(1, p - 1))
                          }
                          disabled={
                            concentrationPage === 1 || loadingConcentrations
                          }
                        >
                          ‹ Trước
                        </Button>
                        <span className="text-sm px-2">
                          {concentrationPage} /{" "}
                          {concentrationPagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setConcentrationPage((p) =>
                              Math.min(
                                concentrationPagination.totalPages,
                                p + 1
                              )
                            )
                          }
                          disabled={
                            concentrationPage ===
                              concentrationPagination.totalPages ||
                            loadingConcentrations
                          }
                        >
                          Sau ›
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bộ lọc participant - giữ nguyên cho phần participants */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Lọc thành viên:</span>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-roles">Tất cả vai trò</SelectItem>
                    <SelectItem value="specialist">Chuyên gia</SelectItem>
                    <SelectItem value="coach">Huấn luyện viên</SelectItem>
                    <SelectItem value="athlete">Vận động viên</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Danh sách thành viên */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Danh sách thành viên ({concentrationParticipants.length}{" "}
                    người)
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        selectedParticipantIds.length ===
                        concentrationParticipants.length
                      ) {
                        setSelectedParticipantIds([]);
                      } else {
                        setSelectedParticipantIds(
                          concentrationParticipants.map((p) => p.id)
                        );
                      }
                    }}
                  >
                    {selectedParticipantIds.length ===
                    concentrationParticipants.length
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"}
                  </Button>
                </div>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {loadingParticipants ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : concentrationParticipants.length > 0 ? (
                    concentrationParticipants.map((participant) => {
                      const isAlreadyInCurrentConcentration =
                        isPersonInConcentration(participant.person.id);
                      const isSelected = selectedParticipantIds.includes(
                        participant.id
                      );

                      return (
                        <div
                          key={participant.id}
                          className={`flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 ${
                            isAlreadyInCurrentConcentration ? "opacity-50" : ""
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedParticipantIds((prev) => [
                                  ...prev,
                                  participant.id,
                                ]);
                              } else {
                                setSelectedParticipantIds((prev) =>
                                  prev.filter((id) => id !== participant.id)
                                );
                              }
                            }}
                            disabled={isAlreadyInCurrentConcentration}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {participant.person.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {participant.role.name}
                              </Badge>
                              {isAlreadyInCurrentConcentration && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Đang tham gia đợt hiện tại
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {participant.organization.name} •{" "}
                              {participant.person.gender} •{" "}
                              {new Date(
                                participant.person.birthday
                              ).getFullYear()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {selectedConcentrationId
                        ? "Đợt tập trung này chưa có thành viên"
                        : "Chọn đợt tập trung để xem danh sách thành viên"}
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin sẽ được copy */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Thông tin sẽ được copy
                  </span>
                </div>
                <div className="text-sm text-blue-700">
                  Vai trò và đơn vị từ đợt tập trung được chọn sẽ được sao chép.
                  Bạn có thể chỉnh sửa sau khi thêm.
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Từ danh sách */}
          <TabsContent
            value="from-list"
            className="space-y-4 flex-1 overflow-y-auto"
          >
            <div className="space-y-4">
              {/* Tìm kiếm */}
              <div className="space-y-2 px-4">
                <Label>Tìm kiếm nhân sự</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập tên, CCCD, số điện thoại..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    clearable
                  />
                  {searchLoading && (
                    <div className="text-sm text-gray-500 mt-2">
                      Đang tìm kiếm...
                    </div>
                  )}
                </div>
              </div>

              {/* Kết quả tìm kiếm */}
              <div className="space-y-2">
                <Label>Kết quả tìm kiếm ({searchResults.length} người)</Label>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((person) => {
                      const isAlreadyInConcentration = isPersonInConcentration(
                        person.id
                      );
                      return (
                        <div
                          key={person.id}
                          className={`flex items-center gap-3 p-3 border-b last:border-b-0 ${
                            isAlreadyInConcentration
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-50 cursor-pointer"
                          } ${
                            selectedPersonId === person.id.toString()
                              ? "bg-blue-50 border-blue-200"
                              : ""
                          }`}
                          onClick={() => {
                            if (!isAlreadyInConcentration) {
                              setSelectedPersonId(person.id.toString());
                            }
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{person.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {person.gender} •{" "}
                                {new Date(person.birthday).getFullYear()}
                              </Badge>
                              {isAlreadyInConcentration && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Đã tham gia
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant={
                              selectedPersonId === person.id.toString()
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            disabled={isAlreadyInConcentration}
                          >
                            {isAlreadyInConcentration
                              ? "Đã tham gia"
                              : selectedPersonId === person.id.toString()
                              ? "Đã chọn"
                              : "Chọn"}
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {searchTerm
                        ? "Không tìm thấy người nào"
                        : "Nhập từ khóa để tìm kiếm"}
                    </div>
                  )}
                </div>
                {errors.personId && (
                  <p className="text-sm text-red-500">{errors.personId}</p>
                )}
              </div>

              {/* Form thông tin tham gia */}
              <ParticipationForm
                formData={fromListFormData}
                onFormDataChange={setFromListFormData}
                roles={roles}
                organizations={organizations}
                errors={errors}
              />
            </div>
          </TabsContent>

          {/* Tab 3: Thêm nhân sự mới */}
          <TabsContent
            value="new-person"
            className="space-y-4 flex-1 overflow-y-auto"
          >
            <div className="space-y-4">
              {/* Thông báo */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Tạo nhân sự mới
                  </span>
                </div>
                <div className="text-sm text-green-700 mt-1">
                  Nhân sự này sẽ được tạo mới và tự động thêm vào đợt tập trung
                  hiện tại.
                </div>
              </div>

              {/* Form thông tin cá nhân */}
              <div className="space-y-4">
                <h4 className="font-medium">Thông tin cá nhân</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên *</Label>
                    <Input
                      placeholder="Nhập họ và tên"
                      value={newPersonFormData.name}
                      onChange={(e) =>
                        setNewPersonFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Giới tính *</Label>
                    <Select
                      value={newPersonFormData.gender}
                      onValueChange={(value) =>
                        setNewPersonFormData((prev) => ({
                          ...prev,
                          gender: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ngày sinh *</Label>
                  <Input
                    type="date"
                    value={newPersonFormData.birthday}
                    onChange={(e) =>
                      setNewPersonFormData((prev) => ({
                        ...prev,
                        birthday: e.target.value,
                      }))
                    }
                  />
                  <p className="text-sm text-gray-500 italic">
                    * Nếu chỉ biết năm sinh, vui lòng nhập ngày 01 tháng 01
                  </p>
                  {errors.birthday && (
                    <p className="text-sm text-red-500">{errors.birthday}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CCCD/CMND</Label>
                    <Input
                      placeholder="Nhập số CCCD/CMND"
                      value={newPersonFormData.identity_number || ""}
                      onChange={(e) =>
                        setNewPersonFormData((prev) => ({
                          ...prev,
                          identity_number: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số BHXH</Label>
                    <Input
                      placeholder="Nhập số BHXH"
                      value={newPersonFormData.social_insurance || ""}
                      onChange={(e) =>
                        setNewPersonFormData((prev) => ({
                          ...prev,
                          social_insurance: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      value={newPersonFormData.phone || ""}
                      onChange={(e) =>
                        setNewPersonFormData((prev) => ({
                          ...prev,
                          phone: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Nhập email"
                      value={newPersonFormData.email || ""}
                      onChange={(e) =>
                        setNewPersonFormData((prev) => ({
                          ...prev,
                          email: e.target.value || null,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Form thông tin tham gia */}
              <ParticipationForm
                formData={participationFormData}
                onFormDataChange={setParticipationFormData}
                roles={roles}
                organizations={organizations}
                errors={errors}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0 bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              "Đang xử lý..."
            ) : (
              <>
                {activeTab === "from-concentration" && "Thêm từ đợt tập trung"}
                {activeTab === "from-list" && "Thêm từ danh sách"}
                {activeTab === "new-person" && "Tạo và thêm vào đợt tập trung"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
