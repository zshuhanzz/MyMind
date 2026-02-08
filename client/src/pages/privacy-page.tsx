import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../config/routes';

export default function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 text-sm text-warmgray-500 hover:text-lavender-500 mb-8"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <h1 className="text-3xl font-heading font-bold text-warmgray-900 mb-8">Privacy & Your Data</h1>

      <div className="space-y-6 text-warmgray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-heading font-bold text-warmgray-900 mb-2">Your data is yours</h2>
          <p>
            Everything you share on MindBridge — your mood entries, journal entries, and conversations —
            belongs to you. We encrypt your data at rest and in transit. You can export or delete it at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-warmgray-900 mb-2">What we store</h2>
          <p>
            We store your account information, mood entries, journal entries, and conversation history
            to provide you with insights and a continuous experience. Conversation content is processed
            through Google's Gemini AI to generate responses.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-warmgray-900 mb-2">Anonymous mode</h2>
          <p>
            You can use MindBridge without providing an email address. In anonymous mode, your session
            is tied to a recovery token. If you lose this token, your data cannot be recovered — by design.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-warmgray-900 mb-2">Crisis detection</h2>
          <p>
            MindBridge monitors conversations for signs of crisis to ensure your safety. When concerning
            language is detected, we display crisis resources. We do not contact anyone on your behalf —
            reaching out is always your choice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-warmgray-900 mb-2">Not a replacement for professional help</h2>
          <p>
            MindBridge is a wellness tool, not a medical service. It is not a substitute for
            professional mental health care. If you're struggling, please reach out to a licensed
            therapist or counselor.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
