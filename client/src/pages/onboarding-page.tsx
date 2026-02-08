import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/ui/button';
import { ROUTES } from '../config/routes';

const steps = [
  {
    title: 'Welcome to MindBridge',
    description:
      "This is your space to check in with yourself, talk through what's on your mind, and track how you're feeling over time. No pressure, no judgment.",
    emoji: '🌿',
  },
  {
    title: 'Quick check-ins',
    description:
      "We'll gently remind you to check in each day. It only takes a moment — rate how you're feeling and pick the emotions that resonate. Over time, you'll start to see patterns.",
    emoji: '📊',
  },
  {
    title: 'Talk to Bridge',
    description:
      "Bridge is an AI companion who listens. You can talk about what's bothering you, process difficult feelings, or just vent. Bridge isn't a therapist, but a supportive presence.",
    emoji: '💬',
  },
  {
    title: "You're all set",
    description:
      "Everything here is private and encrypted. You're in control of your data. Ready to start your first check-in?",
    emoji: '✨',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate(ROUTES.CHECK_IN);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-lavender-500' : 'bg-lavender-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl mb-6">{steps[step].emoji}</div>
            <h2 className="text-2xl font-heading font-bold text-warmgray-900 mb-3">
              {steps[step].title}
            </h2>
            <p className="text-warmgray-500 leading-relaxed mb-10">
              {steps[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)}>
            Continue <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleFinish}>
            <Sparkles size={16} /> Start my first check-in
          </Button>
        )}
      </div>
    </div>
  );
}
