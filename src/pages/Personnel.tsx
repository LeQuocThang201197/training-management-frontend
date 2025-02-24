import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/config/api";
import { PersonForm } from "@/components/forms/PersonForm";

interface Person {
  id: number;
  name: string;
  identity_number: string;
  identity_date: string;
  identity_place: string;
  social_insurance: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    identity_number: "",
    identity_date: "",
    identity_place: "",
    social_insurance: "",
    birthday: "",
    gender: "",
    phone: "",
    email: "",
  });
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/persons`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách nhân sự");

        const data = await response.json();
        if (data.success) {
          setPersonnel(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_URL}/persons${editingPerson ? `/${editingPerson.id}` : ""}`,
        {
          method: editingPerson ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể lưu thông tin nhân sự");

      const data = await response.json();
      if (data.success) {
        if (editingPerson) {
          setPersonnel((prev) =>
            prev.map((p) => (p.id === editingPerson.id ? data.data : p))
          );
        } else {
          setPersonnel((prev) => [...prev, data.data]);
        }
        setIsDialogOpen(false);
        setFormData({
          name: "",
          identity_number: "",
          identity_date: "",
          identity_place: "",
          social_insurance: "",
          birthday: "",
          gender: "",
          phone: "",
          email: "",
        });
        setEditingPerson(null);
      }
    } catch (err) {
      console.error("Save person error:", err);
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      identity_number: person.identity_number,
      identity_date: person.identity_date,
      identity_place: person.identity_place,
      social_insurance: person.social_insurance,
      birthday: person.birthday,
      gender: person.gender,
      phone: person.phone,
      email: person.email,
    });
    setIsDialogOpen(true);
  };

  const filteredPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.identity_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Nhân sự</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingPerson(null);
              setFormData({
                name: "",
                identity_number: "",
                identity_date: "",
                identity_place: "",
                social_insurance: "",
                birthday: "",
                gender: "",
                phone: "",
                email: "",
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm nhân sự
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPerson
                  ? "Chỉnh sửa thông tin nhân sự"
                  : "Thêm nhân sự mới"}
              </DialogTitle>
            </DialogHeader>
            <PersonForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingPerson(null);
              }}
              submitLabel={editingPerson ? "Cập nhật" : "Thêm mới"}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm nhân sự..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số CCCD/CMND</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonnel.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.identity_number}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(person)}
                      >
                        Chỉnh sửa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
