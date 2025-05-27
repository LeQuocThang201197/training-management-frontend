import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  MapPin,
  Shield,
  Users,
  History,
  GraduationCap,
  Pencil,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonForm } from "@/components/dialogs/AddPersonDialog";
import { PersonDetail, PersonFormData } from "@/types/personnel";
import { cn } from "@/lib/utils";

export function PersonnelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent, formData: PersonFormData) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/persons/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể cập nhật thông tin nhân sự");

      const data = await response.json();
      if (data.success) {
        setPerson(data.data);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

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
    <div className="container mx-auto p-6 max-w-7xl">
      <Tabs defaultValue="info" className="space-y-6">
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute top-6 left-6">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:bg-white/20"
                onClick={() => navigate("/management/personnel")}
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Danh sách
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-background" />
          </div>
          <CardContent className="relative -mt-16 px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`}
                />
                <AvatarFallback className="text-2xl">
                  {person.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 flex-1">
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold mb-2">{person.name}</h1>
                  <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{person.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{person.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Pencil className="w-4 h-4" />
                      Chỉnh sửa thông tin
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chỉnh sửa thông tin nhân sự</DialogTitle>
                      </DialogHeader>
                      <PersonForm
                        editingPerson={person}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsDialogOpen(false)}
                        submitLabel="Cập nhật"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <TabsList className="bg-transparent border-0 p-0 w-full flex justify-start gap-6">
                <TabsTrigger
                  value="info"
                  className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                >
                  <GraduationCap className="w-4 h-4" />
                  Học vấn
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary"
                >
                  <History className="w-4 h-4" />
                  Hoạt động
                </TabsTrigger>
              </TabsList>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400">
                          CCCD/CMND
                        </p>
                        <p className="text-lg">{person.identity_number}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400">
                          Ngày cấp
                        </p>
                        <p className="text-lg">
                          {new Date(
                            person.identity_date ?? ""
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400">
                          Nơi cấp
                        </p>
                        <p className="text-lg">{person.identity_place}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400">
                          Bảo hiểm xã hội
                        </p>
                        <p className="text-lg">{person.social_insurance}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400">
                          Ngày sinh
                        </p>
                        <p className="text-lg">
                          {new Date(person.birthday).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400">
                          Giới tính
                        </p>
                        <p className="text-lg">{person.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cập nhật thông tin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ngày tạo
                    </p>
                    <p className="text-lg font-medium">
                      {new Date(person.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cập nhật lần cuối
                    </p>
                    <p className="text-lg font-medium">
                      {new Date(person.updatedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Thông tin học vấn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Chưa có thông tin học vấn
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sắp xếp participations theo startDate của concentration */}
                {person.participations
                  ?.sort(
                    (a, b) =>
                      new Date(a.concentration.startDate).getTime() -
                      new Date(b.concentration.startDate).getTime()
                  )
                  .map((participation) => {
                    // Gộp và sắp xếp các hoạt động theo startDate
                    const activities = [
                      ...participation.concentration.trainings.map(
                        (training) => ({
                          ...training,
                          type: "TRAINING" as const,
                        })
                      ),
                      ...participation.concentration.competitions.map(
                        (competition) => ({
                          ...competition,
                          type: "COMPETITION" as const,
                        })
                      ),
                    ].sort(
                      (a, b) =>
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime()
                    );

                    return (
                      <div key={participation.id} className="space-y-4">
                        {/* Đợt tập trung */}
                        <div className="relative pl-6 pb-6 border-l-2 border-blue-200">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                          <div className="space-y-4">
                            {/* Thông tin đợt tập trung */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-blue-600 font-medium">
                                <Users className="w-4 h-4" />
                                <span>Đợt tập trung</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  participation.concentration.startDate
                                ).toLocaleDateString("vi-VN")}{" "}
                                -{" "}
                                {new Date(
                                  participation.concentration.endDate
                                ).toLocaleDateString("vi-VN")}
                              </p>
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="px-2 py-1 bg-gray-100 rounded-full">
                                  {participation.role.name}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded-full">
                                  {participation.concentration.team.sport}{" "}
                                  {participation.concentration.team.type}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded-full">
                                  {participation.concentration.location}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 rounded-full">
                                  {participation.organization.name}
                                </span>
                              </div>
                            </div>

                            {/* Container cho các hoạt động */}
                            <div className="ml-4 space-y-4 border-l-2 border-gray-100">
                              {activities.map((activity) => (
                                <div
                                  key={activity.id}
                                  className="relative pl-6"
                                >
                                  <div
                                    className={cn(
                                      "absolute -left-[9px] top-0 w-4 h-4 rounded-full",
                                      activity.type === "TRAINING"
                                        ? "bg-emerald-500"
                                        : "bg-amber-500"
                                    )}
                                  />
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 font-medium">
                                      {activity.type === "TRAINING" ? (
                                        <>
                                          <GraduationCap className="w-4 h-4 text-emerald-600" />
                                          <span className="text-emerald-600">
                                            Tập huấn
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Trophy className="w-4 h-4 text-amber-600" />
                                          <span className="text-amber-600">
                                            Thi đấu
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <p className="text-sm">{activity.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {new Date(
                                        activity.startDate
                                      ).toLocaleDateString("vi-VN")}{" "}
                                      -{" "}
                                      {new Date(
                                        activity.endDate
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                                        {activity.location}
                                      </span>
                                      {activity.type === "COMPETITION" &&
                                        activity.isForeign && (
                                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                            Quốc tế
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Hiển thị khi không có hoạt động */}
                {!person.participations?.length && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có hoạt động nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
