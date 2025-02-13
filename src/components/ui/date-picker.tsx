import { forwardRef, useState } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

registerLocale("vi", vi);

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    { value, onChange, placeholder = "Chọn ngày", className, error, disabled },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCalendar = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest(".react-datepicker")) {
        return;
      }
      e.preventDefault();
      setIsOpen(!isOpen);
    };

    return (
      <div ref={ref} className="relative">
        <div
          className={cn(
            "relative flex items-center",
            error && "border-red-500",
            className
          )}
          onClick={toggleCalendar}
        >
          <ReactDatePicker
            selected={value}
            onChange={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            locale="vi"
            dateFormat="dd/MM/yyyy"
            className={cn(
              "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500"
            )}
            placeholderText={placeholder}
            disabled={disabled}
            onClickOutside={() => setIsOpen(false)}
            open={isOpen}
            customInput={
              <div className="flex items-center justify-between cursor-pointer">
                <span className="flex-1">
                  {value ? format(value, "dd/MM/yyyy") : placeholder}
                </span>
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
            }
          />
        </div>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
