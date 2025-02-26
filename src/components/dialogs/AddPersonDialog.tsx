import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState } from "react";

interface FormData {
  name: string;
  identity_number: string;
  identity_date: string;
  identity_place: string;
  social_insurance: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
}

interface PersonFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function PersonForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
}: PersonFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }
    if (!formData.birthday) {
      newErrors.birthday = "Vui lòng nhập ngày sinh";
    }
    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Ngày sinh <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={formData.birthday}
            onChange={(e) =>
              setFormData({ ...formData, birthday: e.target.value })
            }
          />
          <p className="text-sm text-gray-500 italic">
            * Nếu chỉ biết năm sinh, vui lòng nhập ngày 01 tháng 01
          </p>
          {errors.birthday && (
            <p className="text-sm text-red-500">{errors.birthday}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Giới tính <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) =>
              setFormData({ ...formData, gender: value })
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CCCD/CMND</Label>
          <Input
            value={formData.identity_number}
            onChange={(e) =>
              setFormData({ ...formData, identity_number: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Ngày cấp</Label>
          <Input
            type="date"
            value={formData.identity_date}
            onChange={(e) =>
              setFormData({ ...formData, identity_date: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nơi cấp</Label>
        <Input
          value={formData.identity_place}
          onChange={(e) =>
            setFormData({ ...formData, identity_place: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Số BHXH</Label>
        <Input
          value={formData.social_insurance}
          onChange={(e) =>
            setFormData({ ...formData, social_insurance: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Số điện thoại</Label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
