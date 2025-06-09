import { useState } from "react";
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thêm thành viên
          </DialogTitle>
          <DialogDescription>
            Chọn cách thức thêm thành viên vào đợt tập trung
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
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
            className="space-y-4 h-[500px] overflow-y-auto"
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
            className="space-y-4 h-[500px] overflow-y-auto"
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
            className="space-y-4 h-[500px] overflow-y-auto"
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
                    <Input placeholder="Nhập họ và tên" />
                  </div>
                  <div className="space-y-2">
                    <Label>Giới tính *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ngày sinh *</Label>
                  <Input type="date" />
                  <p className="text-sm text-gray-500 italic">
                    * Nếu chỉ biết năm sinh, vui lòng nhập ngày 01 tháng 01
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CCCD/CMND</Label>
                    <Input placeholder="Nhập số CCCD/CMND" />
                  </div>
                  <div className="space-y-2">
                    <Label>Số BHXH</Label>
                    <Input placeholder="Nhập số BHXH" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input placeholder="Nhập số điện thoại" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Nhập email" />
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
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => onSubmit?.({})}>
            {activeTab === "from-concentration" && "Thêm từ đợt tập trung"}
            {activeTab === "from-list" && "Thêm từ danh sách"}
            {activeTab === "new-person" && "Tạo và thêm vào đợt tập trung"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
