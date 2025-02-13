import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types/auth";
import { Pencil, Trash2 } from "lucide-react";
import { getConsistentColor, getRandomColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface HoverCardProps {
  id: string | number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
  status?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  useConsistentColor?: boolean;
}

export function HoverCard({
  id,
  title,
  subtitle,
  description,
  status,
  onEdit,
  onDelete,
  className,
  useConsistentColor = true,
}: HoverCardProps) {
  const bgColor = useConsistentColor
    ? getConsistentColor(id)
    : getRandomColor();

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-300 group relative overflow-hidden",
        bgColor,
        className
      )}
    >
      <div className="p-4 relative">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="absolute right-0 top-0 h-full flex items-center opacity-0 transform translate-x-full transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 bg-gradient-to-l from-white/80 via-white/60 to-transparent pr-2">
          <div className="flex items-center space-x-1">
            {onEdit && (
              <PermissionGate permission={Permission.EDIT_TAG}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/60"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </PermissionGate>
            )}
            {onDelete && (
              <PermissionGate permission={Permission.DELETE_TAG}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/60"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PermissionGate>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
