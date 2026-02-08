import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-sage-100 border-sage-400 text-sage-400',
  error: 'bg-rose-100 border-rose-400 text-rose-400',
  info: 'bg-sky-100 border-sky-400 text-sky-400',
};

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={`
        flex items-center gap-3 px-4 py-3
        border rounded-card shadow-card
        min-w-[300px] max-w-md
        ${styles[toast.type]}
      `}
    >
      <Icon size={18} />
      <p className="flex-1 text-sm text-warmgray-700">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-full hover:bg-white/50 transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
