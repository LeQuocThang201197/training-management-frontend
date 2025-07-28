import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  Building2,
  Tag,
  Link2Off,
  Link2,
  Edit,
  Upload,
} from "lucide-react";

import { DocumentFormDialog } from "@/components/dialogs/DocumentFormDialog";
import { SelectConcentrationsDialog } from "@/components/dialogs/SelectConcentrationsDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Document {
  id: number;
  number: number;
  code: string;
  publisher: string;
  type: string;
  content: string;
  related_year: number;
  date: string;
  file_name: string;
  file_path: string;
  createdAt: string;
  updatedAt: string;
}

interface LinkedConcentration {
  id: number;
  teamId: number;
  sequence_number: number;
  related_year: number;
  location: string;
  startDate: string;
  endDate: string;
  team: {
    id: number;
    sport: string;
    type: string;
    gender: string;
  };
}

export function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedConcentrations, setLinkedConcentrations] = useState<
    LinkedConcentration[]
  >([]);
  const [loadingConcentrations, setLoadingConcentrations] = useState(false);

  const [selectedConcentrationIds, setSelectedConcentrationIds] = useState<
    number[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchLinkedConcentrations = useCallback(async () => {
    try {
      setLoadingConcentrations(true);
      const response = await fetch(`${API_URL}/papers/${id}/concentrations`, {
        credentials: "include",
      });
      if (!response.ok)
        throw new Error("Không thể tải danh sách đợt tập trung liên kết");

      const data = await response.json();
      if (data.success) {
        setLinkedConcentrations(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConcentrations(false);
    }
  }, [id]);

  const refreshDocument = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Không thể tải thông tin văn bản");

      const data = await response.json();
      if (data.success) {
        setDocument(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/papers/${id}/file`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Không thể cập nhật file");

      await refreshDocument();
      setIsFileDialogOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload file error:", err);
      alert("Không thể cập nhật file");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLinkedConcentrations();
  }, [id, fetchLinkedConcentrations]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`${API_URL}/papers/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải thông tin văn bản");

        const data = await response.json();
        if (data.success) {
          setDocument(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleViewFile = async () => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}/file`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải file");

      const data = await response.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("View file error:", err);
      alert("Không thể mở file");
    }
  };

  const handleDownloadFile = async () => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}/download`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải file");

      const data = await response.json();
      if (data.success && data.downloadUrl && typeof window !== "undefined") {
        const link = window.document.createElement("a");
        link.href = data.downloadUrl;
        link.download = data.fileName || document?.file_name || "document";
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download file error:", err);
      alert("Không thể tải file");
    }
  };

  const handleUnlinkConcentration = async (concentrationId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/papers/${id}/concentrations/${concentrationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể bỏ liên kết đợt tập trung");

      const data = await response.json();
      if (data.success) {
        fetchLinkedConcentrations();
      }
    } catch (err) {
      console.error("Unlink concentration error:", err);
    }
  };

  const handleLinkConcentrations = async () => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}/concentrations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ concentrationIds: selectedConcentrationIds }),
      });

      if (!response.ok) throw new Error("Không thể liên kết đợt tập trung");

      const data = await response.json();
      if (data.success) {
        await fetchLinkedConcentrations();
        setSelectedConcentrationIds([]);
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Link concentrations error:", err);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!document) {
    return <div>Không tìm thấy thông tin văn bản</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      {/* Breadcrumb */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/management/papers")}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại Danh sách Văn bản
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            {document.type} - Số: {document.number}/{document.code}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsFileDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Cập nhật file
            </Button>
            <Button variant="outline" onClick={handleViewFile}>
              Xem file
            </Button>
            <Button variant="outline" onClick={handleDownloadFile}>
              Tải xuống
            </Button>
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="h-5 w-5 mr-3 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Ngày ban hành</p>
                <p className="font-medium">
                  {new Date(document.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <Building2 className="h-5 w-5 mr-3 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Đơn vị ban hành</p>
                <p className="font-medium">{document.publisher}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <Tag className="h-5 w-5 mr-3 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Năm liên quan</p>
                <p className="font-medium">{document.related_year}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Trích yếu nội dung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{document.content}</p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Đợt tập trung liên kết</CardTitle>
            <SelectConcentrationsDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onConfirm={handleLinkConcentrations}
              title="Liên kết đợt tập trung"
              description="Chọn các đợt tập trung bạn muốn liên kết với văn bản này"
              confirmText="Liên kết"
              excludeIds={linkedConcentrations.map((c) => c.id)}
              trigger={
                <Button variant="outline" size="sm">
                  <Link2 className="h-4 w-4 mr-2" />
                  Gán đợt tập trung
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {loadingConcentrations ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : linkedConcentrations.length > 0 ? (
            <div className="space-y-4">
              {linkedConcentrations.map((concentration) => (
                <Card key={concentration.id} className="hover:bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/management/concentrations/${concentration.id}`
                          )
                        }
                      >
                        <p className="font-medium">
                          Đội tuyển{" "}
                          {concentration.team.type === "Trẻ" ? "trẻ " : ""}
                          {concentration.team.sport}{" "}
                          {concentration.team.gender === "Cả nam và nữ"
                            ? ""
                            : concentration.team.gender.toLowerCase()}{" "}
                          đợt {concentration.sequence_number} năm{" "}
                          {concentration.related_year}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(concentration.startDate).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(concentration.endDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {concentration.location}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlinkConcentration(concentration.id);
                        }}
                      >
                        <Link2Off className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Chưa có đợt tập trung nào được liên kết
            </p>
          )}
        </CardContent>
      </Card>

      <DocumentFormDialog
        document={document}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={refreshDocument}
      />

      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật file đính kèm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>File hiện tại</Label>
              <p className="text-sm text-muted-foreground">
                {document.file_name}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Chọn file mới</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  File đã chọn: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsFileDialogOpen(false);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Đang tải lên..." : "Cập nhật"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
