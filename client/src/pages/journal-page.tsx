import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Heart, Search } from 'lucide-react';
import Button from '../components/ui/button';
import Card from '../components/ui/card';
import { ROUTES } from '../config/routes';
import apiClient from '../config/api-client';
import type { JournalEntry } from '../types';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    apiClient
      .get(`/journal${params}`)
      .then((r) => setEntries(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  const toggleFavorite = async (id: string) => {
    try {
      await apiClient.patch(`/journal/${id}/favorite`);
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e))
      );
    } catch {
      // silently fail
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-warmgray-900">Journal</h2>
          <p className="text-warmgray-500 mt-1">Your thoughts, your space.</p>
        </div>
        <Link to={ROUTES.JOURNAL_NEW}>
          <Button>
            <Plus size={16} /> New entry
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" />
        <input
          type="text"
          placeholder="Search entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-lavender-200 rounded-input
            text-warmgray-700 placeholder:text-warmgray-400 text-sm
            focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent transition-all"
        />
      </div>

      {entries.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-lavender-100 flex items-center justify-center mb-6">
            <BookOpen className="text-lavender-400" size={28} />
          </div>
          <p className="text-warmgray-500 max-w-sm">
            {search
              ? 'No entries match your search.'
              : "No journal entries yet. Whenever you're ready, this is your space to write about anything."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const e = entry as any; // handle both camelCase and snake_case
            const title = e.title;
            const content = e.content;
            const isFav = e.isFavorite ?? e.is_favorite;
            const date = e.createdAt || e.created_at;
            const wordCount = e.wordCount ?? e.word_count ?? 0;
            const tags = e.tags || [];

            return (
              <Link key={e.id} to={ROUTES.JOURNAL_ENTRY(e.id)}>
                <Card hoverable className="group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-warmgray-900 truncate">
                        {title || 'Untitled'}
                      </p>
                      <p className="text-sm text-warmgray-500 mt-1 line-clamp-2">
                        {content}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-warmgray-400">
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-xs text-warmgray-400">{wordCount} words</span>
                        {tags.length > 0 && (
                          <div className="flex gap-1">
                            {tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-lavender-50 text-lavender-500 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        toggleFavorite(e.id);
                      }}
                      className="p-2 rounded-full hover:bg-lavender-50 transition-colors shrink-0"
                    >
                      <Heart
                        size={16}
                        className={isFav ? 'fill-rose-400 text-rose-400' : 'text-warmgray-300'}
                      />
                    </button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
