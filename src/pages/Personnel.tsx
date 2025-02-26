import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, ArrowUpDown } from "lucide-react";
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
import { PersonForm } from "@/components/dialogs/AddPersonDialog";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface ApiResponse {
  success: boolean;
  data: Person[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  const [sortField, setSortField] = useState<"name" | "birthday">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 10;
  const [searchResults, setSearchResults] = useState<Person[]>([]);

  const fetchPersonnel = useCallback(
    async (page: number, search?: string) => {
      try {
        setLoading(true);
        const sortQuery = `&sortBy=${sortField}&order=${sortDirection}`;
        const url = search
          ? `${API_URL}/persons/search?q=${encodeURIComponent(
              search
            )}${sortQuery}`
          : `${API_URL}/persons?page=${page}&limit=${itemsPerPage}${sortQuery}`;

        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách nhân sự");

        const data: ApiResponse = await response.json();
        if (data.success) {
          if (search) {
            setSearchResults(data.data);
            setTotalPages(1);
          } else {
            setPersonnel(data.data);
            setTotalPages(data.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [sortField, sortDirection]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true);
        setCurrentPage(1);
        fetchPersonnel(1, searchTerm);
      } else {
        fetchPersonnel(currentPage);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage, fetchPersonnel]);

  useEffect(() => {
    if (!searchTerm && !isSearching) {
      fetchPersonnel(currentPage);
    }
  }, [currentPage, searchTerm, isSearching, fetchPersonnel]);

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

  const getBirthYear = (birthday: string) => {
    return new Date(birthday).getFullYear();
  };

  const toggleSort = (field: "name" | "birthday") => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      if (searchTerm) {
        fetchPersonnel(1, searchTerm);
      } else {
        fetchPersonnel(currentPage);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
      if (searchTerm) {
        fetchPersonnel(1, searchTerm);
      } else {
        fetchPersonnel(currentPage);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý nhân sự</h1>
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

      <div className="flex items-center gap-3 mb-6">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
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
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => toggleSort("name")}
                        >
                          Họ và tên
                          <ArrowUpDown
                            className={cn(
                              "h-4 w-4",
                              sortField === "name"
                                ? "opacity-100"
                                : "opacity-40",
                              sortDirection === "desc" && "transform rotate-180"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nhấn để sắp xếp theo tên</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => toggleSort("birthday")}
                        >
                          Năm sinh
                          <ArrowUpDown
                            className={cn(
                              "h-4 w-4",
                              sortField === "birthday"
                                ? "opacity-100"
                                : "opacity-40",
                              sortDirection === "desc" && "transform rotate-180"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nhấn để sắp xếp theo năm sinh</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchTerm
                ? searchResults.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">
                        {person.name}
                      </TableCell>
                      <TableCell>{person.gender}</TableCell>
                      <TableCell>{getBirthYear(person.birthday)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(person)}
                        >
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : personnel.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">
                        {person.name}
                      </TableCell>
                      <TableCell>{person.gender}</TableCell>
                      <TableCell>{getBirthYear(person.birthday)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(person)}
                        >
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!searchTerm && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {personnel.length} trên tổng số {totalPages * itemsPerPage}{" "}
            nhân sự
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1 || loading}
            >
              Trước
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
