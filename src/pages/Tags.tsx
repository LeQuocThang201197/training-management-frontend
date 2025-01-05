import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Tag {
  id: string;
  name: string;
  description: string;
  color: string;
  usageCount: number;
}

export function TagsPage() {
  const [tags] = useState<Tag[]>([
    {
      id: "1",
      name: "Huấn luyện",
      description: "Các hoạt động huấn luyện chính thức",
      color: "bg-orange-100",
      usageCount: 24,
    },
    {
      id: "2",
      name: "Thi đấu",
      description: "Các giải đấu và cuộc thi",
      color: "bg-blue-100",
      usageCount: 15,
    },
    {
      id: "3",
      name: "Chính trị",
      description: "Hoạt động chính trị và đoàn thể",
      color: "bg-green-100",
      usageCount: 18,
    },
  ]);

  const [sortBy, setSortBy] = useState<"name" | "usage">("name");

  const sortedTags = [...tags].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return b.usageCount - a.usageCount;
  });

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thẻ</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSortBy(sortBy === "name" ? "usage" : "name")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sắp xếp theo {sortBy === "name" ? "tên" : "lượt dùng"}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thẻ mới
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input placeholder="Tìm kiếm thẻ..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTags.map((tag) => (
          <Card
            key={tag.id}
            className={`hover:shadow-lg transition-shadow ${tag.color}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full bg-${
                      tag.color.split("-")[1]
                    }-500`}
                  />
                  <CardTitle>{tag.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary">{tag.usageCount} lượt</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{tag.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
