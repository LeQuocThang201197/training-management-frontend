import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Role, Organization } from "@/types/participant";

interface ParticipationFormData {
  roleId: string;
  organizationId: string;
  note: string;
}

interface ParticipationFormProps {
  formData: ParticipationFormData;
  onFormDataChange: (data: ParticipationFormData) => void;
  roles: Role[];
  organizations: Organization[];
  errors?: Record<string, string>;
  disabled?: boolean;
  className?: string;
}

export function ParticipationForm({
  formData,
  onFormDataChange,
  roles,
  organizations,
  errors = {},
  disabled = false,
  className,
}: ParticipationFormProps) {
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");
  const [isOrganizationDropdownOpen, setIsOrganizationDropdownOpen] =
    useState(false);

  // Reset search term when form data changes
  useEffect(() => {
    if (formData.organizationId) {
      const selectedOrg = organizations.find(
        (org) => org.id.toString() === formData.organizationId
      );
      if (selectedOrg) {
        setOrganizationSearchTerm(selectedOrg.name);
      }
    }
  }, [formData.organizationId, organizations]);

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(organizationSearchTerm.toLowerCase().trim())
  );

  const handleOrganizationSelect = (org: Organization) => {
    onFormDataChange({
      ...formData,
      organizationId: org.id.toString(),
    });
    setOrganizationSearchTerm(org.name);
    setIsOrganizationDropdownOpen(false);
  };

  return (
    <div
      className={cn("space-y-4 p-4 border rounded-lg bg-gray-50", className)}
    >
      <h4 className="font-medium">Thông tin tham gia đợt tập trung</h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Vai trò */}
        <div className="space-y-2">
          <Label>Vai trò *</Label>
          <Select
            value={formData.roleId}
            onValueChange={(value) =>
              onFormDataChange({ ...formData, roleId: value })
            }
            disabled={disabled}
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

        {/* Đơn vị */}
        <div className="space-y-2">
          <Label>Đơn vị *</Label>
          <div className="relative">
            <Input
              placeholder="Tìm kiếm đơn vị..."
              value={organizationSearchTerm}
              onChange={(e) => {
                setOrganizationSearchTerm(e.target.value);
                setIsOrganizationDropdownOpen(true);
              }}
              onClick={() => setIsOrganizationDropdownOpen(true)}
              disabled={disabled}
            />
            {isOrganizationDropdownOpen && filteredOrganizations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                {filteredOrganizations.map((org) => (
                  <div
                    key={org.id}
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-gray-100",
                      formData.organizationId === org.id.toString() &&
                        "bg-gray-100"
                    )}
                    onClick={() => handleOrganizationSelect(org)}
                  >
                    {org.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.organizationId && (
            <p className="text-sm text-red-500">{errors.organizationId}</p>
          )}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          placeholder="Nhập ghi chú (nếu có)..."
          value={formData.note}
          onChange={(e) =>
            onFormDataChange({ ...formData, note: e.target.value })
          }
          disabled={disabled}
        />
      </div>
    </div>
  );
}
