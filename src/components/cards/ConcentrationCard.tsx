import { Users, Calendar, MapPin, Dumbbell, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Concentration } from "@/types/concentration";

interface ConcentrationCardProps {
  concentration: Concentration;
  onClick?: (concentration: Concentration) => void;
}

export function ConcentrationCard({
  concentration,
  onClick,
}: ConcentrationCardProps) {
  const navigate = useNavigate();

  const getCardStyle = (concentration: Concentration) => {
    const today = new Date();
    const endDate = new Date(concentration.endDate);
    const isEnded = endDate < today;

    if (isEnded) {
      return "from-gray-50 to-gray-100/50 [&_svg]:text-gray-500 [&_.bg-primary/10]:bg-gray-100/80 [&_h3]:text-gray-600";
    }

    switch (concentration.team.type) {
      case "Trẻ":
        return "from-white to-blue-50 [&_svg]:text-blue-500 [&_.bg-primary/10]:bg-blue-100/50 [&_h3]:text-blue-700";
      case "Người khuyết tật":
        return "from-white to-purple-50 [&_svg]:text-purple-500 [&_.bg-primary/10]:bg-purple-100/50 [&_h3]:text-purple-700";
      case "Tuyển":
        return "from-white to-emerald-50 [&_svg]:text-emerald-500 [&_.bg-primary/10]:bg-emerald-100/50 [&_h3]:text-emerald-700";
      default:
        return "from-white to-primary/5";
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(concentration);
    } else {
      navigate(`/management/concentrations/${concentration.id}`);
    }
  };

  return (
    <div
      className={cn(
        "p-6 border rounded-lg hover:shadow-lg transition-all cursor-pointer",
        "bg-gradient-to-br",
        getCardStyle(concentration),
        "hover:scale-[1.02] hover:-translate-y-1",
        "relative overflow-hidden"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-1.5 rounded-bl",
          new Date(concentration.endDate) < new Date()
            ? "bg-gray-300"
            : concentration.team.type === "Trẻ"
            ? "bg-blue-300"
            : concentration.team.type === "Người khuyết tật"
            ? "bg-purple-300"
            : "bg-emerald-300"
        )}
      />

      {new Date(concentration.endDate) < new Date() && (
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
          Đã kết thúc
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-medium text-lg">
              Đợt {concentration.sequence_number}
            </span>
            <span className="text-sm text-gray-500 block">
              Năm {concentration.related_year}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">
          {concentration.team.type === "Trẻ" ? "Đội trẻ " : "Đội tuyển "}
          {concentration.team.sport}
          {concentration.team.gender !== "Cả nam và nữ" && (
            <span className="font-normal"> ({concentration.team.gender})</span>
          )}
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-full bg-primary/10">
          <Calendar className="h-4 w-4 text-primary/70" />
        </div>
        <span>
          {new Date(concentration.startDate).toLocaleDateString("vi-VN")} -{" "}
          {new Date(concentration.endDate).toLocaleDateString("vi-VN")}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-primary/10">
            <MapPin className="h-4 w-4 text-primary/70" />
          </div>
          <span>{concentration.location}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-primary/10">
            <Users className="h-4 w-4 text-primary/70" />
          </div>
          <div className="flex flex-wrap gap-2">
            {concentration.participantStats.SPECIALIST > 0 && (
              <span>{concentration.participantStats.SPECIALIST} CG</span>
            )}
            {concentration.participantStats.COACH > 0 && (
              <span>{concentration.participantStats.COACH} HLV</span>
            )}
            {concentration.participantStats.ATHLETE > 0 && (
              <span>{concentration.participantStats.ATHLETE} VĐV</span>
            )}
            {Object.values(concentration.participantStats).every(
              (v) => v === 0
            ) && <span>Chưa có người tham gia</span>}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-blue-50">
              <Dumbbell className="h-4 w-4 text-blue-500" />
            </div>
            <span>{concentration.trainings?.length || 0} đợt tập huấn</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-orange-50">
              <Trophy className="h-4 w-4 text-orange-500" />
            </div>
            <span>0 đợt thi đấu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
