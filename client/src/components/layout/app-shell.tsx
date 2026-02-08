import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
import { useAuth } from '../../hooks/use-auth';

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-warmgray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header displayName={user?.displayName || 'Friend'} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
