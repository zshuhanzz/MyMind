import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ClipboardCheck, MessageCircle, Sun } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import apiClient from '../config/api-client';

// affirmations for the "phrase of the day" section
const dailyPhrases = [
  "I prioritize the things that bring me joy, inviting positivity and happiness to my life.",
  "I am worthy of love and kindness, especially from myself.",
  "Today I choose to focus on what I can control and let go of what I can't.",
  "I am growing stronger every day, even when I can't see it.",
  "My feelings are valid, and it's okay to take things one step at a time.",
  "I deserve rest and peace just as much as I deserve success.",
  "Every small step forward is still progress.",
  "I am enough exactly as I am right now.",
];

// pick todays phrase based on the date so its consistent for the day
const todayPhrase = dailyPhrases[new Date().getDate() % dailyPhrases.length];

// plant emoji based on streak
function getPlantEmoji(streak: number) {
  if (streak <= 0) return '🌰';
  if (streak <= 3) return '🌱';
  if (streak <= 7) return '🌿';
  if (streak <= 14) return '🌻';
  return '🌳';
}

const pieColors = ['#9575CD', '#B39DDB', '#82B1D9', '#66BB6A', '#FFA726', '#E57388', '#D4C4F5', '#5C9ACE'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [period, setPeriod] = useState('7d');
  const [emotionBreakdown, setEmotionBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch dashboard data
  useEffect(() => {
    setLoading(true);

    // get summary
    apiClient.get('/dashboard/summary').then((res) => setSummary(res.data)).catch(() => {});

    // get trends
    apiClient.get(`/dashboard/mood-trends?period=${period}`).then((res) => setTrends(res.data)).catch(() => {});

    // get emotion breakdown
    apiClient.get(`/dashboard/emotion-breakdown?period=${period}`).then((res) => setEmotionBreakdown(res.data)).catch(() => {});

    setLoading(false);
  }, [period]);

  // greeting based on time of day
  const hour = new Date().getHours();
  const name = user?.displayName || 'Friend';
  let greeting = `Hey ${name}`;
  if (hour >= 4 && hour < 12) greeting = `Good morning, ${name}`;
  else if (hour >= 12 && hour < 17) greeting = `Good afternoon, ${name}`;
  else if (hour >= 17 && hour < 24) greeting = `Good evening, ${name}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{greeting}</h2>
        <p className="text-gray-500 mt-1">Here's how you've been doing.</p>
      </div>

      {/* quick actions */}
      <div className="flex gap-3">
        <Link to="/check-in">
          <Button variant="secondary"><ClipboardCheck size={16} /> Check in</Button>
        </Link>
        <Link to="/chat">
          <Button variant="ghost"><MessageCircle size={16} /> Talk to Luna</Button>
        </Link>
      </div>

      {/* phrase of the day */}
      <Card className="bg-white">
        <div className="text-center py-4">
          <Sun size={28} className="mx-auto mb-2" style={{ color: '#FFA726' }} />
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Phrase of the Day</p>
          <p className="text-lg font-semibold text-gray-800 max-w-md mx-auto leading-relaxed">
            {todayPhrase}
          </p>
          <button className="mt-4 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50">
            Embrace the Thought
          </button>
        </div>
      </Card>

      {/* stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          {loading ? (
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center text-2xl">
                {getPlantEmoji(summary?.currentStreak || 0)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-in streak</p>
                <p className="font-bold text-gray-900 text-xl">{summary?.currentStreak || 0} days</p>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <p className="text-sm text-gray-500 mb-2">This week's average</p>
          {summary?.weeklyAverage ? (
            <p className="font-bold text-3xl text-gray-900">{summary.weeklyAverage}<span className="text-lg text-gray-400">/10</span></p>
          ) : (
            <p className="text-gray-400 text-sm">No check-ins yet</p>
          )}
        </Card>

        <Card>
          <p className="text-sm text-gray-500 mb-2">Top feelings</p>
          {summary?.topEmotions && summary.topEmotions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {summary.topEmotions.map((e: any) => (
                <span key={e.name} className="px-2.5 py-1 bg-[#F5F0FF] text-[#7E57C2] text-xs font-medium rounded-full">{e.name}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Your emotion trends will show up here</p>
          )}
        </Card>
      </div>

      {/* mood chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-900">Mood over time</p>
          <div className="flex gap-1">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-full ${period === p ? 'bg-[#7E57C2] text-white' : 'text-gray-500 hover:bg-[#F5F0FF]'}`}
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
              <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} tick={{ fontSize: 11, fill: '#A8A29E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#A8A29E' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip />
              <Area type="monotone" dataKey="avg_rating" stroke="#9575CD" strokeWidth={2} fill="url(#moodGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center border border-dashed border-[#D4C4F5] rounded-xl">
            <p className="text-gray-400 text-sm">Complete a few check-ins and your mood chart will appear here.</p>
          </div>
        )}
      </Card>

      {/* emotion breakdown pie chart */}
      {emotionBreakdown.length > 0 && (
        <Card>
          <p className="text-sm font-semibold text-gray-900 mb-4">Emotion breakdown</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={emotionBreakdown} dataKey="count" nameKey="emotion" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {emotionBreakdown.map((_: any, i: number) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {emotionBreakdown.map((item: any, i: number) => (
                <div key={item.emotion} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                  <span className="text-sm text-gray-600">{item.emotion} ({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
