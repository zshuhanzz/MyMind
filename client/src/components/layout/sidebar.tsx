import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageCircle,
  ClipboardCheck,
  BookOpen,
  Settings,
  Download,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.DASHBOARD },
  { icon: MessageCircle, label: 'Talk', to: ROUTES.CHAT },
  { icon: ClipboardCheck, label: 'Check-in', to: ROUTES.CHECK_IN },
  { icon: BookOpen, label: 'Journal', to: ROUTES.JOURNAL },
  { icon: Download, label: 'Export', to: ROUTES.EXPORT },
  { icon: Settings, label: 'Settings', to: ROUTES.SETTINGS },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-lavender-100 h-full">
      <div className="p-6">
        <h1 className="text-xl font-heading font-bold text-lavender-500 flex items-center gap-2">
          <span className="w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </span>
          MindBridge
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-button text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-lavender-50 text-lavender-600 shadow-soft'
                  : 'text-warmgray-500 hover:bg-lavender-50 hover:text-warmgray-700'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-lavender-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-button text-sm font-medium text-warmgray-400 hover:bg-rose-100 hover:text-rose-400 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
