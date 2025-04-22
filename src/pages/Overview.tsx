import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Medal, Calendar, Trophy } from "lucide-react";

export function OverviewPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tổng quan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Athletes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Vận động viên
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                đang tập trung huấn luyện
              </p>
            </CardContent>
          </Card>

          {/* Coaches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Huấn luyện viên
              </CardTitle>
              <Medal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                đang tham gia huấn luyện
              </p>
            </CardContent>
          </Card>

          {/* Training Concentrations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Đợt tập trung
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">đang diễn ra</p>
            </CardContent>
          </Card>

          {/* Competitions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Giải đấu</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">trong tháng này</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
