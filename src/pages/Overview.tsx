import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Trophy, Dumbbell, Home, Plane } from "lucide-react";
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

interface CompetitionStats {
  total: number;
  byLocation: {
    domestic: number;
    foreign: number;
  };
  byTeamType: {
    ADULT: {
      total: number;
      domestic: number;
      foreign: number;
    };
    JUNIOR: {
      total: number;
      domestic: number;
      foreign: number;
    };
    DISABILITY: {
      total: number;
      domestic: number;
      foreign: number;
    };
  };
}

interface TrainingStats {
  total: number;
  byLocation: {
    domestic: number;
    foreign: number;
  };
  byTeamType: {
    ADULT: {
      total: number;
      domestic: number;
      foreign: number;
    };
    JUNIOR: {
      total: number;
      domestic: number;
      foreign: number;
    };
    DISABILITY: {
      total: number;
      domestic: number;
      foreign: number;
    };
  };
}

// First, let's create a styled wrapper for each card type
const StyledCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={`transition-all hover:shadow-md ${className}`}>
    {children}
  </Card>
);

export function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [competitionStats, setCompetitionStats] =
    useState<CompetitionStats | null>(null);
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(
    null
  );

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

    const fetchCompetitionStats = async () => {
      try {
        const response = await fetch(`${API_URL}/overview/competitions`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch competition stats");

        const data = await response.json();
        if (data.success) {
          setCompetitionStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching competition stats:", err);
      }
    };

    fetchCompetitionStats();

    const fetchTrainingStats = async () => {
      try {
        const response = await fetch(`${API_URL}/overview/trainings`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch training stats");

        const data = await response.json();
        if (data.success) {
          setTrainingStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching training stats:", err);
      }
    };

    fetchTrainingStats();
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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {/* Concentrations */}
          <StyledCard className="bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Đợt tập trung
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline justify-between mb-6">
                <div className="pl-4">
                  <div className="text-3xl font-bold">
                    {stats?.concentrations?.total || 0}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  đang diễn ra
                </div>
              </div>
              <div className="space-y-2.5 text-sm border-t pt-4">
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
          </StyledCard>

          {/* Personnel */}
          <StyledCard className="bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                Nhân sự
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline justify-between mb-6">
                <div className="pl-4">
                  <div className="text-3xl font-bold">
                    {(stats?.participants?.total?.ATHLETE || 0) +
                      (stats?.participants?.total?.COACH || 0) +
                      (stats?.participants?.total?.SPECIALIST || 0)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  đang tham gia tập trung
                </div>
              </div>
              <div className="space-y-2.5 text-sm border-t pt-4">
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
          </StyledCard>

          {/* Competitions */}
          <StyledCard className="bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Thi đấu
              </CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-center gap-3 pl-4">
                  <div className="text-3xl font-bold">
                    {competitionStats?.total || 0}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {competitionStats?.byLocation?.domestic || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="h-3 w-3" />
                      {competitionStats?.byLocation?.foreign || 0}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  đội đang tham gia
                </div>
              </div>
              <div className="space-y-2.5 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Đội tuyển:</span>
                  <span className="flex items-center gap-1">
                    {competitionStats?.byTeamType?.ADULT?.total || 0} đội
                    <span className="text-muted-foreground/75 ml-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {competitionStats?.byTeamType?.ADULT?.domestic || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        {competitionStats?.byTeamType?.ADULT?.foreign || 0}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội trẻ:</span>
                  <span className="flex items-center gap-1">
                    {competitionStats?.byTeamType?.JUNIOR?.total || 0} đội
                    <span className="text-muted-foreground/75 ml-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {competitionStats?.byTeamType?.JUNIOR?.domestic || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        {competitionStats?.byTeamType?.JUNIOR?.foreign || 0}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội khuyết năng:</span>
                  <span className="flex items-center gap-1">
                    {competitionStats?.byTeamType?.DISABILITY?.total || 0} đội
                    <span className="text-muted-foreground/75 ml-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {competitionStats?.byTeamType?.DISABILITY?.domestic ||
                          0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        {competitionStats?.byTeamType?.DISABILITY?.foreign || 0}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </StyledCard>

          {/* Trainings */}
          <StyledCard className="bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Tập huấn
              </CardTitle>
              <Dumbbell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-center gap-3 pl-4">
                  <div className="text-3xl font-bold">
                    {trainingStats?.total || 0}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {trainingStats?.byLocation?.domestic || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="h-3 w-3" />
                      {trainingStats?.byLocation?.foreign || 0}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  đội đang tham gia
                </div>
              </div>
              <div className="space-y-2.5 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Đội tuyển:</span>
                  <span className="flex items-center gap-1">
                    {trainingStats?.byTeamType?.ADULT?.total || 0} đội
                    <span className="text-muted-foreground/75 ml-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {trainingStats?.byTeamType?.ADULT?.domestic || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        {trainingStats?.byTeamType?.ADULT?.foreign || 0}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội trẻ:</span>
                  <span className="flex items-center gap-1">
                    {trainingStats?.byTeamType?.JUNIOR?.total || 0} đội
                    <span className="text-muted-foreground/75 ml-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {trainingStats?.byTeamType?.JUNIOR?.domestic || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        {trainingStats?.byTeamType?.JUNIOR?.foreign || 0}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đội khuyết năng:</span>
                  <span className="flex items-center gap-1">
                    {trainingStats?.byTeamType?.DISABILITY?.total || 0} đội
                    <span className="text-muted-foreground/75 ml-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {trainingStats?.byTeamType?.DISABILITY?.domestic || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        {trainingStats?.byTeamType?.DISABILITY?.foreign || 0}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </StyledCard>
        </div>
      </CardContent>
    </Card>
  );
}
