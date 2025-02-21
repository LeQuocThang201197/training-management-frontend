import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonFormData {
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
  formData: PersonFormData;
  setFormData: React.Dispatch<React.SetStateAction<PersonFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function PersonForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel = "Thêm mới",
}: PersonFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Họ và tên *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="identity_number">Số CCCD/CMND</Label>
          <Input
            id="identity_number"
            value={formData.identity_number}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                identity_number: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identity_date">Ngày cấp</Label>
          <input
            type="date"
            id="identity_date"
            value={formData.identity_date}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                identity_date: e.target.value,
              }))
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identity_place">Nơi cấp</Label>
        <Input
          id="identity_place"
          value={formData.identity_place}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              identity_place: e.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_insurance">Số BHXH</Label>
        <Input
          id="social_insurance"
          value={formData.social_insurance}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              social_insurance: e.target.value,
            }))
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthday">Ngày sinh</Label>
          <input
            type="date"
            id="birthday"
            value={formData.birthday}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                birthday: e.target.value,
              }))
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            className="w-full p-2 border rounded-md"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gender: e.target.value,
              }))
            }
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
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
