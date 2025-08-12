import { UserMinus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConcentrationCard } from "./ConcentrationCard";
import { Concentration } from "@/types/concentration";

interface ConcentrationCardWrapperProps {
  concentration: Concentration;
  onRemove?: (concentrationId: number) => void;
  onCardClick?: (concentration: Concentration) => void;
  removeButtonText?: string;
  removeButtonTitle?: string;
  removeButtonIcon?: React.ReactNode;
  removeButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  removeButtonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ConcentrationCardWrapper({
  concentration,
  onRemove,
  onCardClick,
  removeButtonText,
  removeButtonTitle = "Rút đội tuyển",
  removeButtonIcon,
  removeButtonVariant = "ghost",
  removeButtonSize = "sm",
  className = "",
}: ConcentrationCardWrapperProps) {
  return (
    <div className={`relative group ${className}`}>
      <ConcentrationCard
        concentration={concentration}
        onClick={onCardClick ? () => onCardClick(concentration) : undefined}
      />

      {/* Remove button - positioned to avoid conflicts with status badges */}
      {onRemove && (
        <Button
          variant={removeButtonVariant}
          size={removeButtonSize}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-600 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg hover:scale-110 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(concentration.id);
          }}
          title={removeButtonTitle}
        >
          {removeButtonIcon}
          {removeButtonText && <span className="ml-1">{removeButtonText}</span>}
        </Button>
      )}
    </div>
  );
}

// Specialized card for selection contexts (e.g., dialogs)
interface SelectConcentrationCardProps {
  concentration: Concentration;
  selected?: boolean;
  disabled?: boolean;
  onSelect: (concentrationId: number) => void;
  className?: string;
}

export function SelectConcentrationCard({
  concentration,
  selected = false,
  disabled = false,
  onSelect,
  className = "",
}: SelectConcentrationCardProps) {
  return (
    <div
      className={`relative rounded-lg transition-all p-2 ${
        selected
          ? "ring-2 ring-primary border-2 border-primary/20"
          : "border-2 border-transparent"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <ConcentrationCardWrapper
        concentration={concentration}
        onCardClick={() => !disabled && onSelect(concentration.id)}
        className={className}
      />

      {/* Selection indicator */}
      {selected && (
        <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}

// Convenience components for specific contexts
export function CompetitionConcentrationCard({
  concentration,
  onRemove,
}: {
  concentration: Concentration;
  onRemove: (concentrationId: number) => void;
}) {
  return (
    <ConcentrationCardWrapper
      concentration={concentration}
      onRemove={onRemove}
      removeButtonTitle="Rút đội tuyển khỏi giải đấu"
      removeButtonIcon={<UserMinus className="h-4 w-4" />}
    />
  );
}
