import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/use-auth';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import { ROUTES } from '../config/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAnonymous } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAnonymous();
      navigate(ROUTES.ONBOARDING);
    } catch {
      setError('Could not create anonymous session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-block">
            <h1 className="text-2xl font-heading font-bold text-lavender-500">MindBridge</h1>
          </Link>
          <p className="text-warmgray-500 mt-2">Welcome back. How are you today?</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-rose-400 bg-rose-100 px-4 py-2 rounded-input">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-lavender-100" />
            <span className="text-xs text-warmgray-400">or</span>
            <div className="flex-1 h-px bg-lavender-100" />
          </div>

          <Button
            variant="ghost"
            onClick={handleAnonymous}
            disabled={loading}
            className="w-full"
          >
            Continue anonymously
          </Button>
        </div>

        <p className="text-center text-sm text-warmgray-500 mt-6">
          New here?{' '}
          <Link to={ROUTES.REGISTER} className="text-lavender-500 hover:text-lavender-600 font-medium">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
