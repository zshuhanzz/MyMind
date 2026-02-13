import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Card from '../components/ui/card';
import Toggle from '../components/ui/toggle';
import Button from '../components/ui/button';
import Modal from '../components/ui/modal';
import { useAuth } from '../hooks/use-auth';
import apiClient from '../config/api-client';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await apiClient.delete('/users/me');
      logout();
      navigate('/');
    } catch {
      // ignore
    }
    setDeleting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Make My Mind work the way you need it to.</p>
      </div>

      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm font-medium text-gray-900">{user?.displayName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium text-gray-900">{user?.email || 'Not set'}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Check-in reminders</h3>
        <div className="space-y-4">
          <Toggle enabled={emailEnabled} onChange={setEmailEnabled} label="Email reminders" />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Privacy</h3>
        <p className="text-sm text-gray-500">
          Your conversations and journal entries are private. We never share your data.
          You can export or delete your data at any time.
        </p>
      </Card>

      <Card className="border-red-200">
        <h3 className="font-bold text-gray-900 mb-4">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Deleting your account will permanently remove all your data. This cannot be undone.
        </p>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete my account</Button>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete account?">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-gray-600">
            This will permanently delete all your data. This cannot be reversed.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Keep my account</Button>
          <Button variant="danger" onClick={handleDeleteAccount} loading={deleting}>Yes, delete everything</Button>
        </div>
      </Modal>
    </div>
  );
}
