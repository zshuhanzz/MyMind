import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import MobileNav from './mobile-nav';

interface HeaderProps {
  displayName: string;
  onLogout: () => void;
}

export default function Header({ displayName, onLogout }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Hey there';
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-lavender-100 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-button text-warmgray-500 hover:bg-lavender-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm text-warmgray-400 font-body">{getGreeting()}</p>
              <p className="font-heading font-bold text-warmgray-900">{displayName}</p>
            </div>
          </div>

          <button className="p-2 rounded-button text-warmgray-400 hover:bg-lavender-50 hover:text-lavender-500 transition-colors relative">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} onLogout={onLogout} />
    </>
  );
}
