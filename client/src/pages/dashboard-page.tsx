import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ClipboardCheck, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import Skeleton from '../components/ui/skeleton';
import { ROUTES } from '../config/routes';
import apiClient from '../config/api-client';
import type { DashboardSummary, MoodTrend } from '../types';

const PLANT_STAGES = ['🌰', '🌱', '🌿', '🌻', '🌳'];

function getPlant(streak: number): string {
  if (streak <= 0) return PLANT_STAGES[0];
  if (streak <= 3) return PLANT_STAGES[1];
  if (streak <= 7) return PLANT_STAGES[2];
  if (streak <= 14) return PLANT_STAGES[3];
  return PLANT_STAGES[4];
}

const PIE_COLORS = ['#9575CD', '#B39DDB', '#82B1D9', '#66BB6A', '#FFA726', '#E57388', '#D4C4F5', '#5C9ACE'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [period, setPeriod] = useState('7d');
  const [emotionBreakdown, setEmotionBreakdown] = useState<{ emotion: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get('/dashboard/summary').catch(() => ({ data: null })),
      apiClient.get(`/dashboard/mood-trends?period=${period}`).catch(() => ({ data: [] })),
      apiClient.get(`/dashboard/emotion-breakdown?period=${period}`).catch(() => ({ data: [] })),
    ]).then(([summaryRes, trendsRes, emotionRes]) => {
      if (summaryRes.data) setSummary(summaryRes.data);
      setTrends(trendsRes.data);
      setEmotionBreakdown(emotionRes.data);
      setLoading(false);
    });
  }, [period]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.displayName || 'Friend';
    if (hour >= 5 && hour < 12) return `Good morning, ${name}. A new day, a fresh start.`;
    if (hour >= 12 && hour < 17) return `Hey ${name}, how's your afternoon going?`;
    if (hour >= 17 && hour < 21) return `Good evening, ${name}. Winding down?`;
    return `Still up, ${name}? It's okay to take it slow.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-2xl font-heading font-bold text-warmgray-900">{getGreeting()}</h2>
        <p className="text-warmgray-500 mt-1">Here's how you've been doing.</p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link to={ROUTES.CHECK_IN}>
          <Button variant="secondary" size="sm">
            <ClipboardCheck size={16} /> Check in
          </Button>
        </Link>
        <Link to={ROUTES.CHAT}>
          <Button variant="ghost" size="sm">
            <MessageCircle size={16} /> Talk to Bridge
          </Button>
        </Link>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center text-2xl">
                {getPlant(summary?.currentStreak || 0)}
              </div>
              <div>
                <p className="text-sm text-warmgray-500">Check-in streak</p>
                <p className="font-heading font-bold text-warmgray-900 text-xl">
                  {summary?.currentStreak || 0} days
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card hoverable>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <>
              <p className="text-sm text-warmgray-500 mb-2">This week's average</p>
              {summary?.weeklyAverage ? (
                <p className="font-heading font-bold text-3xl text-warmgray-900">
                  {summary.weeklyAverage}<span className="text-lg text-warmgray-400">/10</span>
                </p>
              ) : (
                <p className="text-warmgray-400 text-sm font-accent text-lg">
                  No check-ins yet. Whenever you're ready.
                </p>
              )}
            </>
          )}
        </Card>

        <Card hoverable>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <>
              <p className="text-sm text-warmgray-500 mb-2">Top feelings</p>
              {summary?.topEmotions && summary.topEmotions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {summary.topEmotions.map((e) => (
                    <span
                      key={e.name}
                      className="px-2.5 py-1 bg-lavender-50 text-lavender-600 text-xs font-medium rounded-full"
                    >
                      {e.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-warmgray-400 text-sm font-accent text-lg">
                  Your emotion trends will show up here.
                </p>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Mood chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-heading font-semibold text-warmgray-900">Mood over time</p>
          <div className="flex gap-1">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  period === p
                    ? 'bg-lavender-500 text-white'
                    : 'text-warmgray-500 hover:bg-lavender-50'
                }`}
              >
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
              </button>
            ))}
          </div>
        </div>

        {trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9575CD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9575CD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                tick={{ fontSize: 11, fill: '#A8A29E' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[1, 10]}
                tick={{ fontSize: 11, fill: '#A8A29E' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #EDE5FF',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(179, 157, 219, 0.12)',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [`${value}/10`, 'Average mood']}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                }
              />
              <Area
                type="monotone"
                dataKey="avg_rating"
                stroke="#9575CD"
                strokeWidth={2.5}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center border border-dashed border-lavender-200 rounded-card">
            <p className="text-warmgray-400 text-sm">
              Complete a few check-ins and your mood chart will appear here.
            </p>
          </div>
        )}
      </Card>

      {/* Emotion breakdown */}
      {emotionBreakdown.length > 0 && (
        <Card>
          <p className="text-sm font-heading font-semibold text-warmgray-900 mb-4">Emotion breakdown</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionBreakdown}
                    dataKey="count"
                    nameKey="emotion"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {emotionBreakdown.map((_entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #EDE5FF',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {emotionBreakdown.map((item, i) => (
                <div key={item.emotion} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-sm text-warmgray-600">
                    {item.emotion} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
