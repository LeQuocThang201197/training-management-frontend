import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      const response = await fetch(`${API_URL}/persons`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể thêm nhân sự");

      const data = await response.json();
      if (data.success) {
        setPersonnel((prev) => [...prev, data.data]);
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
      }
    } catch (err) {
      console.error("Create person error:", err);
    }
  };

  const filteredPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.identity_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quản lý Nhân sự</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm nhân sự
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm nhân sự mới</DialogTitle>
              </DialogHeader>
              <PersonForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
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
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
