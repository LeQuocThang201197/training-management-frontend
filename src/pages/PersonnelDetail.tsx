import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function PersonnelDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/persons/${id}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Không thể tải thông tin nhân sự");

        const data = await response.json();
        if (data.success) {
          setPerson(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin nhân sự:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-8">Không tìm thấy thông tin nhân sự</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Card>
          <CardContent className="flex items-center gap-6 p-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`}
              />
              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold mb-2">{person.name}</h1>
              <p className="text-gray-600">ID: {person.id}</p>
              <p className="text-gray-600">Email: {person.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">CCCD/CMND</p>
                  <p>{person.identity_number}</p>
                </div>
                <div>
                  <p className="font-semibold">Ngày cấp</p>
                  <p>
                    {new Date(person.identity_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Nơi cấp</p>
                  <p>{person.identity_place}</p>
                </div>
                <div>
                  <p className="font-semibold">Bảo hiểm xã hội</p>
                  <p>{person.social_insurance}</p>
                </div>
                <div>
                  <p className="font-semibold">Ngày sinh</p>
                  <p>{new Date(person.birthday).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <p className="font-semibold">Giới tính</p>
                  <p>{person.gender}</p>
                </div>
                <div>
                  <p className="font-semibold">Số điện thoại</p>
                  <p>{person.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
