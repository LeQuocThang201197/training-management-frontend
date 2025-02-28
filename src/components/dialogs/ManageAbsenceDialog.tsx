import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Participant } from "@/types/participant";
import { UserMinus, Plane, FileText } from "lucide-react";

interface ManageAbsenceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant;
}

export function ManageAbsenceDialog({
  isOpen,
  onOpenChange,
  participant,
}: ManageAbsenceDialogProps) {
  const [activeTab, setActiveTab] = useState("remove");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Quản lý vắng mặt - {participant.person.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="remove" className="flex items-center gap-2">
              <UserMinus className="h-4 w-4" />
              Rời đợt tập trung
            </TabsTrigger>
            <TabsTrigger value="mission" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Tập huấn/Thi đấu
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nghỉ phép
            </TabsTrigger>
          </TabsList>

          <TabsContent value="remove" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Ngày rời đợt tập trung</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Ghi chú</Label>
                <Input placeholder="Lý do rời đợt tập trung..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button>Xác nhận</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mission" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Chọn đợt tập huấn/thi đấu</Label>
                {/* Thêm dropdown chọn đợt tập huấn/thi đấu */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Ngày kết thúc</Label>
                  <Input type="date" />
                </div>
              </div>
              <div>
                <Label>Ghi chú</Label>
                <Input placeholder="Thông tin bổ sung..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button>Xác nhận</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ngày bắt đầu nghỉ</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Ngày kết thúc nghỉ</Label>
                  <Input type="date" />
                </div>
              </div>
              <div>
                <Label>Lý do</Label>
                <Input placeholder="Lý do xin nghỉ..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button>Xác nhận</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
