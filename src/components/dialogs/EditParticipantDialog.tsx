import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Role, Organization, ParticipantFormData } from "@/types/participant";
import { ParticipationForm } from "@/components/ParticipationForm";

interface EditParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ParticipantFormData) => void;
  participantId?: number;
  concentrationId?: string;
}

interface ParticipantDetail {
  id: number;
  person_id: number;
  concentration_id: number;
  role_id: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  organization_id: number;
  assigned_by: number;
  person: {
    id: number;
    name: string;
    name_search: string;
    identity_number: string | null;
    identity_date: string | null;
    identity_place: string | null;
    social_insurance: string | null;
    birthday: string;
    phone: string | null;
    email: string | null;
    createdAt: string;
    updatedAt: string;
    gender: string;
    created_by: number;
  };
  role: {
    id: number;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  organization: {
    id: number;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function EditParticipantDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  participantId,
  concentrationId,
}: EditParticipantDialogProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [formData, setFormData] = useState({
    personId: "",
    roleId: "",
    organizationId: "",
    note: "",
  });

  // State cho thông tin participant
  const [participantDetail, setParticipantDetail] =
    useState<ParticipantDetail | null>(null);
  const [loadingParticipant, setLoadingParticipant] = useState(false);

  // State cho lỗi
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Fetch participant detail khi có participantId
  useEffect(() => {
    const fetchParticipantDetail = async () => {
      if (!participantId || !concentrationId || !isOpen) return;

      try {
        setLoadingParticipant(true);
        const response = await fetch(
          `${API_URL}/concentrations/${concentrationId}/participants/${participantId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Không thể tải thông tin thành viên");

        const data = await response.json();
        if (data.success) {
          setParticipantDetail(data.data);
          // Cập nhật form data
          setFormData({
            personId: data.data.person_id.toString(),
            roleId: data.data.role_id.toString(),
            organizationId: data.data.organization_id.toString(),
            note: data.data.note || "",
          });
        }
      } catch (err) {
        console.error("Fetch participant detail error:", err);
      } finally {
        setLoadingParticipant(false);
      }
    };

    fetchParticipantDetail();
  }, [participantId, concentrationId, isOpen]);

  // Reset form khi đóng dialog
  const resetForm = () => {
    setFormData({
      personId: "",
      roleId: "",
      organizationId: "",
      note: "",
    });
    setParticipantDetail(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.roleId) newErrors.roleId = "Vui lòng chọn vai trò";
    if (!formData.organizationId)
      newErrors.organizationId = "Vui lòng chọn đơn vị";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
    resetForm();
  };

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Format phone number
  const formatPhone = (phone: string | null) => {
    if (!phone) return "Chưa có";
    return phone;
  };

  // Format email
  const formatEmail = (email: string | null) => {
    if (!email) return "Chưa có";
    return email;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chỉnh sửa thành viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin thành viên trong đợt tập trung.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-y-auto"
        >
          {/* Thông tin cá nhân (read-only) */}
          {loadingParticipant ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : participantDetail ? (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium">Thông tin cá nhân</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Họ và tên</Label>
                  <Input
                    value={participantDetail.person.name}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Giới tính</Label>
                  <Input
                    value={participantDetail.person.gender}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Ngày sinh</Label>
                <Input
                  value={formatDate(participantDetail.person.birthday)}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">CCCD/CMND</Label>
                  <Input
                    value={
                      participantDetail.person.identity_number || "Chưa có"
                    }
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Số BHXH</Label>
                  <Input
                    value={
                      participantDetail.person.social_insurance || "Chưa có"
                    }
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Số điện thoại</Label>
                  <Input
                    value={formatPhone(participantDetail.person.phone)}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Email</Label>
                  <Input
                    value={formatEmail(participantDetail.person.email)}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy thông tin thành viên
            </div>
          )}

          {/* Form thông tin tham gia */}
          {participantDetail && (
            <ParticipationForm
              formData={{
                roleId: formData.roleId,
                organizationId: formData.organizationId,
                note: formData.note,
              }}
              onFormDataChange={(data) =>
                setFormData((prev) => ({
                  ...prev,
                  roleId: data.roleId,
                  organizationId: data.organizationId,
                  note: data.note,
                }))
              }
              roles={roles}
              organizations={organizations}
              errors={errors}
            />
          )}

          <div className="flex justify-end gap-2 flex-shrink-0 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!participantDetail}>
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
