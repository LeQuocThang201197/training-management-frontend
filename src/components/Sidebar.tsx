import { useState } from "react";
import {
  ChartPie,
  ClipboardList,
  Medal,
  UserPlus,
  UserMinus,
  Container,
  Dumbbell,
  Trophy,
  ChevronDown,
  Settings,
  Tag,
  UserCog,
  User,
  Users,
  Volleyball,
  FileText,
  SquareUserRound,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  children?: { name: string; icon: LucideIcon }[];
}

const menuItems: MenuItem[] = [
  { name: "Tổng quan", icon: ChartPie },
  {
    name: "Quản lý",
    icon: ClipboardList,
    children: [
      { name: "Văn bản, giấy tờ", icon: FileText },
      { name: "Tập trung", icon: Container },
      { name: "Tập huấn Bổ sung", icon: UserPlus },
      { name: "Thôi tập huấn", icon: UserMinus },
      { name: "Tập huấn", icon: Dumbbell },
      { name: "Thi đấu", icon: Trophy },
      { name: "Nhân sự", icon: User },
    ],
  },
  {
    name: "Thiết lập",
    icon: Settings,
    children: [
      { name: "Nhân sự", icon: SquareUserRound },
      { name: "Thẻ", icon: Tag },
      { name: "Vai trò", icon: UserCog },
      { name: "Môn thể thao", icon: Volleyball },
      { name: "Đội", icon: Users },
    ],
  },
  { name: "Thành tích", icon: Medal },
];

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const handleClick = (item: MenuItem) => {
    if (item.children) {
      toggleDropdown(item.name);
    } else {
      onPageChange(item.name);
    }
  };

  const handleChildClick = (childName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPageChange(childName);
  };

  const isItemActive = (item: MenuItem) => {
    return (
      currentPage === item.name ||
      item.children?.some((child) => child.name === currentPage)
    );
  };

  return (
    <aside
      className={cn(
        "w-64 h-[calc(100vh-4rem)]",
        "mt-16",
        "fixed left-0",
        "bg-background border-r border-border",
        "transition-colors duration-300",
        "z-40"
      )}
    >
      <ul className="py-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <a
              href="#"
              onClick={() => handleClick(item)}
              className={cn(
                "flex items-center justify-between",
                "px-6 py-3 mx-2",
                "rounded-lg",
                "text-foreground dark:text-white",
                "hover:bg-orange-100 dark:hover:bg-orange-900/20",
                "transition-colors duration-200",
                "cursor-pointer",
                isItemActive(item) &&
                  "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    "mr-3",
                    isItemActive(item) && "text-orange-600 dark:text-orange-400"
                  )}
                  size={20}
                />
                {item.name}
              </div>
              {item.children && (
                <ChevronDown
                  size={18}
                  className={cn(
                    "transform transition-transform duration-200",
                    openDropdown === item.name ? "rotate-0" : "-rotate-90"
                  )}
                />
              )}
            </a>
            {item.children && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openDropdown === item.name ? "max-h-96" : "max-h-0"
                )}
              >
                <ul className="bg-gray-50 dark:bg-gray-900">
                  {item.children.map((child) => (
                    <li
                      key={child.name}
                      className={cn(
                        "transform transition-all duration-300",
                        openDropdown === item.name
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-3 opacity-0"
                      )}
                    >
                      <a
                        href="#"
                        onClick={(e) => handleChildClick(child.name, e)}
                        className={cn(
                          "flex items-center",
                          "px-6 py-2 pl-12",
                          "text-foreground dark:text-white",
                          "hover:text-orange-600 dark:hover:text-orange-400",
                          "transition-colors duration-200",
                          "text-sm",
                          currentPage === child.name &&
                            "text-orange-600 dark:text-orange-400"
                        )}
                      >
                        <child.icon
                          className={cn(
                            "mr-3",
                            currentPage === child.name &&
                              "text-orange-600 dark:text-orange-400"
                          )}
                          size={16}
                        />
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
