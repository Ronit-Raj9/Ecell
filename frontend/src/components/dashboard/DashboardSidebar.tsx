import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Bell, 
  Settings,
  User,
  ImageIcon,
} from 'lucide-react';

// Define sidebar items
const generalItems = [
  {
    title: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    href: "/dashboard",
    roles: ["member", "admin", "superadmin"],
  },
  {
    title: "My Profile",
    icon: <User className="h-5 w-5" />,
    href: "/dashboard/profile",
    roles: ["member", "admin", "superadmin"],
  },
];

const adminItems = [
  {
    title: "Team Management",
    icon: <Users className="h-5 w-5" />,
    href: "/dashboard/team",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Event Management",
    icon: <Calendar className="h-5 w-5" />,
    href: "/dashboard/events",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Resources",
    icon: <FileText className="h-5 w-5" />,
    href: "/dashboard/resources",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Announcements",
    icon: <Bell className="h-5 w-5" />,
    href: "/dashboard/announcements",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Gallery",
    icon: <ImageIcon className="h-5 w-5" />,
    href: "/dashboard/gallery",
    roles: ["admin", "superadmin"],
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/dashboard/settings",
    roles: ["superadmin"],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role || 'member';

  // Filter sidebar items based on user role
  const filteredAdminItems = adminItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b border-gray-200 dark:border-gray-800 px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg font-semibold text-primary">E-Cell Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {generalItems.map((item) => (
              <SidebarLink 
                key={item.href} 
                item={item}
                isActive={pathname === item.href}
              />
            ))}
            
            {filteredAdminItems.length > 0 && (
              <>
                <div className="my-2 px-3">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Administration
                  </h3>
                </div>
                
                {filteredAdminItems.map((item) => (
                  <SidebarLink 
                    key={item.href} 
                    item={item}
                    isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
                  />
                ))}
              </>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: {
    title: string;
    icon: React.ReactNode;
    href: string;
  };
  isActive: boolean;
}

function SidebarLink({ item, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "bg-gray-100 dark:bg-gray-800 text-primary dark:text-primary-light font-medium"
      )}
    >
      {item.icon}
      <span>{item.title}</span>
    </Link>
  );
} 