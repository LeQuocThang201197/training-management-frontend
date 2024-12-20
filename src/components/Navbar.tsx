import { Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background shadow-md p-4 z-50 border-b border-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">
          Quản lý Huấn luyện và Công tác Chính trị
        </h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="mr-2" size={20} />
            <span>Thông báo</span>
          </Button>
          <Button
            variant="ghost"
            className="text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User className="mr-2" size={20} />
            <span>Tài khoản</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
