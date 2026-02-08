import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileNav({ isOpen, onClose, onLogout }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-warmgray-900/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-card-hover z-50 lg:hidden flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <h1 className="text-xl font-heading font-bold text-lavender-500">MindBridge</h1>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-warmgray-400 hover:bg-lavender-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {navItems.map(({ icon: Icon, label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-lavender-50 text-lavender-600'
                        : 'text-warmgray-500 hover:bg-lavender-50'
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
                onClick={() => { onLogout(); onClose(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium text-warmgray-400 hover:bg-rose-100 hover:text-rose-400 transition-all duration-200 w-full"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
