import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Card from '../components/ui/card';
import Toggle from '../components/ui/toggle';
import Button from '../components/ui/button';
import Modal from '../components/ui/modal';
import { useAuth } from '../hooks/use-auth';
import apiClient from '../config/api-client';
import { ROUTES } from '../config/routes';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await apiClient.delete('/users/me');
      logout();
      navigate(ROUTES.HOME);
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-warmgray-900">Settings</h2>
        <p className="text-warmgray-500 mt-1">Make MindBridge work the way you need it to.</p>
      </div>

      <Card>
        <h3 className="font-heading font-bold text-warmgray-900 mb-4">Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warmgray-600">Name</span>
            <span className="text-sm font-medium text-warmgray-900">{user?.displayName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-warmgray-600">Email</span>
            <span className="text-sm font-medium text-warmgray-900">{user?.email || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-warmgray-600">Timezone</span>
            <span className="text-sm font-medium text-warmgray-900">{user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-heading font-bold text-warmgray-900 mb-4">Check-in reminders</h3>
        <div className="space-y-4">
          <Toggle
            enabled={pushEnabled}
            onChange={setPushEnabled}
            label="Push notifications"
          />
          <Toggle
            enabled={emailEnabled}
            onChange={setEmailEnabled}
            label="Email reminders"
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-heading font-bold text-warmgray-900 mb-4">Privacy</h3>
        <p className="text-sm text-warmgray-500 leading-relaxed">
          Your conversations and journal entries are encrypted. We never share your data with anyone.
          You can export or delete your data at any time.
        </p>
      </Card>

      <Card className="border-rose-200">
        <h3 className="font-heading font-bold text-warmgray-900 mb-4">Danger zone</h3>
        <p className="text-sm text-warmgray-500 mb-4">
          Deleting your account will permanently remove all your data, including mood entries,
          journal entries, and conversation history. This cannot be undone.
        </p>
        <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
          Delete my account
        </Button>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete account?">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-warmgray-600">
            This will permanently delete all your data — mood entries, journal entries, conversations,
            and your profile. This action cannot be reversed.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Keep my account
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} loading={deleting}>
            Yes, delete everything
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
