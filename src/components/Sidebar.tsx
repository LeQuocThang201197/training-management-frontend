import { useState, useEffect } from "react";
import {
  ChartPie,
  ClipboardList,
  // Medal,
  Calendar,
  // Dumbbell,
  // Trophy,
  ChevronDown,
  Settings,
  Tag,
  UserCog,
  User,
  Users,
  Volleyball,
  FileText,
  SquareUserRound,
  // ChartNoAxesCombined,
  // NotebookPen,
  // ChartColumnIncreasing,
  LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Building,
  Shield,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { PermissionGate } from "@/components/PermissionGate";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path?: string;
  children?: {
    name: string;
    icon: LucideIcon;
    path?: string;
    requireAdmin?: boolean;
  }[];
}

const menuItems: MenuItem[] = [
  { name: "Tổng quan", icon: ChartPie, path: "/overview" },
  {
    name: "Quản lý",
    icon: ClipboardList,
    children: [
      {
        name: "Văn bản, giấy tờ",
        icon: FileText,
        path: "/management/papers",
      },
      {
        name: "Tập trung",
        icon: Calendar,
        path: "/management/concentrations",
      },
      // { name: "Tập huấn", icon: Dumbbell, path: "/management/trainings" },
      // { name: "Thi đấu", icon: Trophy, path: "/management/competitions" },
      { name: "Quản lý nhân sự", icon: User, path: "/management/personnel" },
      { name: "Quản lý đội", icon: Users, path: "/management/teams" },
      {
        name: "Quản lý môn thể thao",
        icon: Volleyball,
        path: "/management/sports",
      },
    ],
  },
  // { name: "Thành tích", icon: Medal, path: "/achievement" },
  // {
  //   name: "Tổ chuyên môn",
  //   icon: ChartNoAxesCombined,
  //   children: [
  //     {
  //       name: "Thói quen ghi chép",
  //       icon: NotebookPen,
  //       path: "/specialized-team/habit",
  //     },
  //     {
  //       name: "Chỉ số",
  //       icon: ChartColumnIncreasing,
  //       path: "/specialized-team/statistics",
  //     },
  //   ],
  // },
  {
    name: "Thiết lập",
    icon: Settings,
    children: [
      {
        name: "Vai trò nhân sự",
        icon: SquareUserRound,
        path: "/settings/roles/personnel",
      },
      { name: "Danh mục thẻ", icon: Tag, path: "/settings/categories/tags" },
      {
        name: "Danh mục môn thể thao",
        icon: Volleyball,
        path: "/settings/categories/sports",
      },
      { name: "Danh mục đội", icon: Users, path: "/settings/categories/teams" },
      {
        name: "Danh mục đơn vị",
        icon: Building,
        path: "/settings/categories/organizations",
      },
      {
        name: "Quản lý người dùng",
        icon: UserCog,
        path: "/settings/users",
        requireAdmin: true,
      },
      {
        name: "Quản lý vai trò",
        icon: Shield,
        path: "/settings/roles",
        requireAdmin: true,
      },
      {
        name: "Danh sách quyền",
        icon: Lock,
        path: "/settings/permissions",
        requireAdmin: true,
      },
    ],
  },
];

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

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
    } else if (item.path) {
      setOpenDropdown(null);
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (item.path && location.pathname === item.path) {
      return true;
    }

    // Kiểm tra xem path hiện tại có bắt đầu bằng path của menu cha không
    if (item.children) {
      const basePath = item.children[0].path?.split("/")[1]; // Lấy phần đầu của path (management, settings, etc)
      return location.pathname.startsWith(`/${basePath}`);
    }

    return false;
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
              {item.children ? (
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
              ) : (
                <Link
                  to={item.path || "#"}
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
                </Link>
              )}
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
                        {child.requireAdmin ? (
                          <PermissionGate permission="ADMIN">
                            <Link
                              to={child.path || "#"}
                              className={cn(
                                "flex items-center",
                                "px-6 py-2 pl-12",
                                "text-foreground",
                                "hover:text-orange-600",
                                "transition-colors duration-200",
                                "text-sm",
                                location.pathname === child.path &&
                                  "text-orange-600"
                              )}
                            >
                              <child.icon
                                className={cn(
                                  "mr-3",
                                  location.pathname === child.path &&
                                    "text-orange-600"
                                )}
                                size={16}
                              />
                              {child.name}
                            </Link>
                          </PermissionGate>
                        ) : (
                          <Link
                            to={child.path || "#"}
                            className={cn(
                              "flex items-center",
                              "px-6 py-2 pl-12",
                              "text-foreground",
                              "hover:text-orange-600",
                              "transition-colors duration-200",
                              "text-sm",
                              location.pathname === child.path &&
                                "text-orange-600"
                            )}
                          >
                            <child.icon
                              className={cn(
                                "mr-3",
                                location.pathname === child.path &&
                                  "text-orange-600"
                              )}
                              size={16}
                            />
                            {child.name}
                          </Link>
                        )}
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
