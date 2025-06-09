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
import { Textarea } from "@/components/ui/textarea";
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
import { Role, Organization } from "@/types/participant";

interface AddParticipantMultiDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: unknown) => void;
}

export function AddParticipantMultiDialog({
  isOpen,
  onOpenChange,
  onSubmit,
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
      setErrors({});
      setActiveTab("from-concentration");
    }
  }, [isOpen]);

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

      if (!personResponse.ok) throw new Error("Không thể tạo nhân sự mới");

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
      }
    } catch (err) {
      console.error("Create new person error:", err);
      alert("Có lỗi xảy ra khi tạo nhân sự mới");
    } finally {
      setLoading(false);
    }
  };

  // Handle submit chung
  const handleSubmit = () => {
    if (activeTab === "new-person") {
      handleSubmitNewPerson();
    } else {
      // TODO: Implement cho các tab khác
      onSubmit?.({ type: activeTab });
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
              {/* Chọn đợt tập trung */}
              <div className="space-y-2">
                <Label>Chọn đợt tập trung</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đợt tập trung để copy thành viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concentration-1">
                      <div className="flex items-center justify-between w-full">
                        <span>Đội tuyển Bóng đá Nam - Hà Nội</span>
                        <Badge variant="secondary" className="ml-2">
                          Đang diễn ra
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="concentration-2">
                      <div className="flex items-center justify-between w-full">
                        <span>Đội tuyển Bóng chuyền Nữ - TP.HCM</span>
                        <Badge variant="outline" className="ml-2">
                          Đã kết thúc
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bộ lọc */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Lọc:</span>
                </div>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">Tất cả</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-roles">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-roles">Tất cả vai trò</SelectItem>
                    <SelectItem value="athlete">Vận động viên</SelectItem>
                    <SelectItem value="coach">Huấn luyện viên</SelectItem>
                    <SelectItem value="specialist">Chuyên gia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Danh sách thành viên */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Danh sách thành viên (12 người)</Label>
                  <Button variant="outline" size="sm">
                    Chọn tất cả
                  </Button>
                </div>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {/* Mock data */}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <Checkbox />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Nguyễn Văn A</span>
                          <Badge variant="secondary" className="text-xs">
                            VĐV
                          </Badge>
                          {item === 1 && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Đang tham gia đợt khác
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sở Văn hóa Thể thao Hà Nội • Nam • 1995
                        </div>
                      </div>
                    </div>
                  ))}
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
              <div className="space-y-2">
                <Label>Tìm kiếm nhân sự</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập tên, CCCD, số điện thoại..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Bộ lọc nhanh */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Lọc nhanh:</span>
                <Button variant="outline" size="sm">
                  Chưa từng tham gia
                </Button>
                <Button variant="outline" size="sm">
                  Tham gia gần đây
                </Button>
                <Button variant="outline" size="sm">
                  Cùng đơn vị
                </Button>
              </div>

              {/* Kết quả tìm kiếm */}
              <div className="space-y-2">
                <Label>Kết quả tìm kiếm (25 người)</Label>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Trần Thị B</span>
                          {item === 1 ? (
                            <Badge variant="outline" className="text-xs">
                              Chưa tham gia
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Đã tham gia 2 đợt
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Nữ • 1998 • 0987654321 • tran.b@email.com
                        </div>
                        <div className="text-sm text-gray-500">
                          Sở Văn hóa Thể thao TP.HCM
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Chọn
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form thông tin tham gia */}
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium">Thông tin tham gia</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vai trò *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="athlete">Vận động viên</SelectItem>
                        <SelectItem value="coach">Huấn luyện viên</SelectItem>
                        <SelectItem value="specialist">Chuyên gia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Đơn vị *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Sở VH-TT Hà Nội</SelectItem>
                        <SelectItem value="hcm">Sở VH-TT TP.HCM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú (nếu có)..." />
                </div>
              </div>
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
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium">
                  Thông tin tham gia đợt tập trung
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vai trò *</Label>
                    <Select
                      value={participationFormData.roleId}
                      onValueChange={(value) =>
                        setParticipationFormData((prev) => ({
                          ...prev,
                          roleId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.roleId && (
                      <p className="text-sm text-red-500">{errors.roleId}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Đơn vị *</Label>
                    <Select
                      value={participationFormData.organizationId}
                      onValueChange={(value) =>
                        setParticipationFormData((prev) => ({
                          ...prev,
                          organizationId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id.toString()}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organizationId && (
                      <p className="text-sm text-red-500">
                        {errors.organizationId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea
                    placeholder="Nhập ghi chú (nếu có)..."
                    value={participationFormData.note}
                    onChange={(e) =>
                      setParticipationFormData((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
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
