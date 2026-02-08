import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/button';
import { ROUTES } from '../config/routes';
import apiClient from '../config/api-client';

export default function JournalEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const isNew = !id || id === 'new';

  useEffect(() => {
    if (!isNew) {
      apiClient.get(`/journal/${id}`).then((r) => {
        const e = r.data;
        setTitle(e.title || '');
        setContent(e.content || '');
      }).catch(() => navigate(ROUTES.JOURNAL));
    }
  }, [id, isNew, navigate]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/journal', {
          title: title || undefined,
          content,
          tags: [],
        });
      } else {
        await apiClient.put(`/journal/${id}`, {
          title: title || undefined,
          content,
        });
      }
      navigate(ROUTES.JOURNAL);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    try {
      await apiClient.delete(`/journal/${id}`);
      navigate(ROUTES.JOURNAL);
    } catch {
      // silently fail
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={ROUTES.JOURNAL}
          className="p-2 rounded-button text-warmgray-400 hover:bg-lavender-50 hover:text-lavender-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-heading font-bold text-warmgray-900">
          {isNew ? 'New entry' : 'Edit entry'}
        </h2>
        <div className="flex-1" />
        {!isNew && (
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 size={14} />
          </Button>
        )}
        <Button onClick={handleSave} loading={saving} disabled={!content.trim()}>
          <Save size={16} /> Save
        </Button>
      </div>

      <div className="space-y-4">
        <input
          placeholder="Give this entry a title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-heading font-semibold text-warmgray-900
            bg-transparent border-none px-0 placeholder:text-warmgray-400
            focus:outline-none focus:ring-0"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... what's on your mind today?"
          rows={20}
          className="w-full px-0 py-3 bg-transparent border-none
            text-warmgray-700 placeholder:text-warmgray-400
            focus:outline-none focus:ring-0
            resize-none font-body text-base leading-relaxed"
        />
      </div>

      <div className="mt-4 text-xs text-warmgray-400">
        {content.split(/\s+/).filter(Boolean).length} words
      </div>
    </motion.div>
  );
}
