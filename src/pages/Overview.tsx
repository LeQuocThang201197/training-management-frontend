import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Medal, Calendar, Trophy } from "lucide-react";
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
              <div className="text-2xl font-bold">
                {stats?.concentrations?.total || 0}
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div>
                  Đội tuyển: {stats?.concentrations?.byTeamType?.ADULT || 0}
                </div>
                <div>
                  Đội trẻ: {stats?.concentrations?.byTeamType?.JUNIOR || 0}
                </div>
                <div>
                  TTKN: {stats?.concentrations?.byTeamType?.DISABILITY || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Athletes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Vận động viên
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.participants?.total?.ATHLETE || 0}
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div>Đội tuyển: {getTeamTypeStats("ADULT", "ATHLETE")}</div>
                <div>Đội trẻ: {getTeamTypeStats("JUNIOR", "ATHLETE")}</div>
                <div>TTKN: {getTeamTypeStats("DISABILITY", "ATHLETE")}</div>
              </div>
            </CardContent>
          </Card>

          {/* Staff */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Ban huấn luyện
              </CardTitle>
              <Medal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats?.participants?.total?.COACH || 0) +
                  (stats?.participants?.total?.SPECIALIST || 0)}
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div>HLV: {stats?.participants?.total?.COACH || 0}</div>
                <div>
                  Chuyên gia: {stats?.participants?.total?.SPECIALIST || 0}
                </div>
                <div>Khác: {stats?.participants?.total?.OTHER || 0}</div>
              </div>
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
