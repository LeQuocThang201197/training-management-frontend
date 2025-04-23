import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Trophy, Dumbbell } from "lucide-react";
import { API_URL } from "@/config/api";

interface OverviewStats {
  concentrations: {
    total: number;
    byTeamType: {
      ADULT: number;
      JUNIOR: number;
      DISABILITY: number;
    };
  };
  participants: {
    total: {
      ATHLETE: number;
      COACH: number;
      SPECIALIST: number;
      OTHER?: number;
    };
    byTeamType: {
      ADULT: {
        ATHLETE: number;
        COACH: number;
        SPECIALIST: number;
        OTHER?: number;
      };
      JUNIOR: {
        ATHLETE: number;
        COACH: number;
        SPECIALIST: number;
        OTHER?: number;
      };
      DISABILITY: {
        ATHLETE: number;
        COACH: number;
        SPECIALIST: number;
        OTHER?: number;
      };
    };
  };
}

export function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const response = await fetch(`${API_URL}/overview`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch overview stats");

        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching overview stats:", err);
      }
    };

    fetchOverviewStats();
  }, []);

  // Helper function to safely get team type stats
  const getTeamTypeStats = (
    type: "ADULT" | "JUNIOR" | "DISABILITY",
    role: "ATHLETE" | "COACH" | "SPECIALIST"
  ) => {
    return stats?.participants?.byTeamType?.[type]?.[role] || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tổng quan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Concentrations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Đợt tập trung
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {stats?.concentrations?.total || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  đang diễn ra
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground border-t mt-2 pt-2">
                <div className="flex justify-between">
                  <span>Đội tuyển:</span>
                  <span>
                    {stats?.concentrations?.byTeamType?.ADULT || 0} đợt
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội trẻ:</span>
                  <span>
                    {stats?.concentrations?.byTeamType?.JUNIOR || 0} đợt
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội khuyết năng:</span>
                  <span>
                    {stats?.concentrations?.byTeamType?.DISABILITY || 0} đợt
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personnel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nhân sự</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {(stats?.participants?.total?.ATHLETE || 0) +
                    (stats?.participants?.total?.COACH || 0) +
                    (stats?.participants?.total?.SPECIALIST || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  đang tham gia tập trung
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground border-t mt-2 pt-2">
                <div className="flex justify-between">
                  <span>Đội tuyển:</span>
                  <span>
                    {`${getTeamTypeStats(
                      "ADULT",
                      "SPECIALIST"
                    )} CG - ${getTeamTypeStats(
                      "ADULT",
                      "COACH"
                    )} HLV - ${getTeamTypeStats("ADULT", "ATHLETE")} VĐV`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội trẻ:</span>
                  <span>
                    {`${getTeamTypeStats(
                      "JUNIOR",
                      "SPECIALIST"
                    )} CG - ${getTeamTypeStats(
                      "JUNIOR",
                      "COACH"
                    )} HLV - ${getTeamTypeStats("JUNIOR", "ATHLETE")} VĐV`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội khuyết năng:</span>
                  <span>
                    {`${getTeamTypeStats(
                      "DISABILITY",
                      "SPECIALIST"
                    )} CG - ${getTeamTypeStats(
                      "DISABILITY",
                      "COACH"
                    )} HLV - ${getTeamTypeStats("DISABILITY", "ATHLETE")} VĐV`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Thi đấu</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-muted-foreground">
                  đang diễn ra
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground border-t mt-2 pt-2">
                <div>Chưa có dữ liệu</div>
              </div>
            </CardContent>
          </Card>

          {/* Trainings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tập huấn</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-muted-foreground">
                  đang diễn ra
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground border-t mt-2 pt-2">
                <div>Chưa có dữ liệu</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
