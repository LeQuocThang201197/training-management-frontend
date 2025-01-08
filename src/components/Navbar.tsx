import { Bell, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background shadow-md p-2 sm:p-4 z-50 border-b border-border">
      <div className="flex justify-between items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          Quản lý Huấn luyện và Công tác Chính trị
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="hidden sm:inline ml-2">Thông báo</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">{user?.fullName}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="font-normal text-sm text-muted-foreground">
                  Đăng nhập với
                </div>
                <div className="font-medium">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                Vai trò: {user?.role.value}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
