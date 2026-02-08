import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, TrendingUp } from 'lucide-react';
import Button from '../components/ui/button';
import { ROUTES } from '../config/routes';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 via-white to-sky-50">
      {/* Crisis Banner - always visible */}
      <div className="bg-rose-100 text-center py-2 px-4">
        <p className="text-sm text-warmgray-700">
          If you're in crisis, help is available.{' '}
          <strong className="text-rose-400">Call or text 988</strong>
        </p>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Breathing circle */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-lavender-200/50 animate-breathe" />
              <div className="absolute inset-3 rounded-full bg-lavender-300/40 animate-breathe" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-6 rounded-full bg-lavender-400/30 animate-breathe" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-warmgray-900 mb-4">
            A quiet space for your mind
          </h1>
          <p className="text-lg text-warmgray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            MindBridge helps you check in with yourself, talk through what's on your mind,
            and notice patterns in how you're feeling. No judgment, just support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg">Get started</Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="lg">Sign in</Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          <FeatureCard
            icon={<Heart className="text-rose-400" size={24} />}
            title="Daily check-ins"
            description="A gentle prompt to notice how you're feeling. Track your mood over time and spot patterns."
          />
          <FeatureCard
            icon={<TrendingUp className="text-lavender-500" size={24} />}
            title="Talk it through"
            description="Chat with Bridge, an AI companion who listens without judgment and asks the right questions."
          />
          <FeatureCard
            icon={<Shield className="text-sage-400" size={24} />}
            title="Your space, your pace"
            description="Everything stays private. Use it anonymously, export your data, or share with your therapist."
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-lavender-100 py-8 text-center">
        <p className="text-sm text-warmgray-400">
          MindBridge is not a substitute for professional mental health care.{' '}
          <Link to={ROUTES.PRIVACY} className="text-lavender-500 hover:text-lavender-600 underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-lavender-50 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-warmgray-900 mb-2">{title}</h3>
      <p className="text-sm text-warmgray-500 leading-relaxed">{description}</p>
    </div>
  );
}
