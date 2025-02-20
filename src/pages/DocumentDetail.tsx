import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Building2, Tag } from "lucide-react";

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

export function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("View file error:", err);
      alert("Không thể mở file");
    }
  };

  const handleDownloadFile = async () => {
    try {
      const response = await fetch(`${API_URL}/papers/${id}/file`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      if (typeof window !== "undefined" && window.document) {
        const link = window.document.createElement("a");
        link.href = url;
        link.download = document?.file_name || "document";
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download file error:", err);
      alert("Không thể tải file");
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
            <Button variant="outline" onClick={handleViewFile}>
              Xem file
            </Button>
            <Button onClick={handleDownloadFile}>Tải xuống</Button>
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
    </div>
  );
}
