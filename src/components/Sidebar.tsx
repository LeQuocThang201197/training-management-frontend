import { useState, useEffect } from "react";
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
  ChartNoAxesCombined,
  NotebookPen,
  ChartColumnIncreasing,
  LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  {
    name: "Tổ chuyên môn",
    icon: ChartNoAxesCombined,
    children: [
      { name: "Thói quen ghi chép", icon: NotebookPen },
      { name: "Chỉ số", icon: ChartColumnIncreasing },
    ],
  },
];

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({
  currentPage,
  onPageChange,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      onCollapsedChange(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [onCollapsedChange]);

  const toggleDropdown = (menuName: string) => {
    if (!collapsed) {
      setOpenDropdown(openDropdown === menuName ? null : menuName);
    }
  };

  const handleClick = (item: MenuItem) => {
    if (item.children) {
      if (collapsed) {
        onCollapsedChange(false);
        setTimeout(() => {
          setOpenDropdown(item.name);
        }, 300);
      } else {
        toggleDropdown(item.name);
      }
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
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 overflow-y-auto",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <ul className="flex-1 py-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                onClick={() => handleClick(item)}
                className={cn(
                  "flex items-center",
                  collapsed ? "justify-center" : "justify-between",
                  "px-6 py-3 mx-2",
                  "rounded-lg",
                  "text-foreground",
                  "hover:bg-orange-100",
                  "transition-colors duration-200",
                  "cursor-pointer",
                  isItemActive(item) && "bg-orange-100 text-orange-600"
                )}
              >
                <div className={cn("flex items-center", collapsed && "m-0")}>
                  <item.icon
                    className={cn(
                      collapsed ? "mr-0" : "mr-3",
                      isItemActive(item) && "text-orange-600"
                    )}
                    size={20}
                  />
                  {!collapsed && item.name}
                </div>
                {!collapsed && item.children && (
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transform transition-transform duration-200",
                      openDropdown === item.name ? "rotate-0" : "-rotate-90"
                    )}
                  />
                )}
              </a>
              {!collapsed && item.children && (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    openDropdown === item.name ? "max-h-96" : "max-h-0"
                  )}
                >
                  <ul className="bg-gray-50">
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
                            "text-foreground",
                            "hover:text-orange-600",
                            "transition-colors duration-200",
                            "text-sm",
                            currentPage === child.name && "text-orange-600"
                          )}
                        >
                          <child.icon
                            className={cn(
                              "mr-3",
                              currentPage === child.name && "text-orange-600"
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
        <div className="sticky bottom-0 p-2 border-t bg-background">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
