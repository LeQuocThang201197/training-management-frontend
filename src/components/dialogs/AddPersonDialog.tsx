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
import { useState, useEffect } from "react";
import { PersonFormData, Person } from "@/types/personnel";

const initialFormData: PersonFormData = {
  name: "",
  identity_number: null,
  identity_date: null,
  identity_place: null,
  social_insurance: null,
  birthday: "",
  gender: "",
  phone: null,
  email: null,
};

interface PersonFormProps {
  onSubmit: (e: React.FormEvent, formData: PersonFormData) => void;
  onCancel: () => void;
  submitLabel: string;
  editingPerson: Person | null;
}

export function PersonForm({ editingPerson, ...props }: PersonFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingPerson) {
      setFormData({
        name: editingPerson.name,
        identity_number: editingPerson.identity_number || null,
        identity_date: editingPerson.identity_date?.split("T")[0] || null,
        identity_place: editingPerson.identity_place || null,
        social_insurance: editingPerson.social_insurance || null,
        birthday: editingPerson.birthday.split("T")[0],
        gender: editingPerson.gender,
        phone: editingPerson.phone || null,
        email: editingPerson.email || null,
      });
    }
  }, [editingPerson]);

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
    props.onSubmit(e, formData);
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
            value={formData.identity_number ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, identity_number: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Ngày cấp</Label>
          <Input
            type="date"
            value={formData.identity_date ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, identity_date: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nơi cấp</Label>
        <Input
          value={formData.identity_place ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, identity_place: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Số BHXH</Label>
        <Input
          value={formData.social_insurance ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, social_insurance: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Số điện thoại</Label>
          <Input
            value={formData.phone ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={props.onCancel}>
          Hủy
        </Button>
        <Button type="submit">{props.submitLabel}</Button>
      </div>
    </form>
  );
}
