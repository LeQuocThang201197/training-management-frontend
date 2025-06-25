import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, User } from "lucide-react";

interface DuplicatePerson {
  id: number;
  name: string;
  gender: boolean;
  birthday: string;
  identity_number: string;
  social_insurance: string;
}

interface DuplicateInfo {
  message: string;
  person: DuplicatePerson;
}

interface DuplicatePersonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateInfo: DuplicateInfo | null;
}

export function DuplicatePersonDialog({
  isOpen,
  onOpenChange,
  duplicateInfo,
}: DuplicatePersonDialogProps) {
  const handleViewDetails = () => {
    if (duplicateInfo) {
      // Mở trang chi tiết nhân sự trong tab mới
      window.open(`/management/personnel/${duplicateInfo.person.id}`, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Thông tin trùng lặp
          </DialogTitle>
          <DialogDescription>{duplicateInfo?.message}</DialogDescription>
        </DialogHeader>

        {duplicateInfo && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{duplicateInfo.person.name}</h4>
                  <p className="text-sm text-gray-600">
                    {duplicateInfo.person.gender ? "Nam" : "Nữ"} •{" "}
                    {new Date(duplicateInfo.person.birthday).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {duplicateInfo.person.identity_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">CCCD/CMND:</span>
                    <span className="font-medium">
                      {duplicateInfo.person.identity_number}
                    </span>
                  </div>
                )}
                {duplicateInfo.person.social_insurance && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số BHXH:</span>
                    <span className="font-medium">
                      {duplicateInfo.person.social_insurance}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
              <Button className="flex-1" onClick={handleViewDetails}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Xem chi tiết
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
