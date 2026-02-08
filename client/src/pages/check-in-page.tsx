import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, MessageCircle } from 'lucide-react';
import Button from '../components/ui/button';
import { EMOTIONS } from '../config/emotions';
import { MOOD_LABELS } from '../config/constants';
import { ROUTES } from '../config/routes';
import apiClient from '../config/api-client';

export default function CheckInPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rating, setRating] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleEmotion = (name: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const getMoodColor = () => {
    if (rating <= 3) return 'bg-rose-100';
    if (rating <= 6) return 'bg-amber-100';
    return 'bg-sage-100';
  };

  const getMoodFace = () => {
    if (rating <= 2) return '😔';
    if (rating <= 4) return '😕';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '🙂';
    return '😊';
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await apiClient.post('/check-ins', {
        rating,
        emotionTags: selectedEmotions,
        note: note || undefined,
      });
      setCompleted(true);
    } catch {
      // Silently mark as completed even on API failure — don't block the user
      setCompleted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-20"
      >
        <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
          <Check className="text-sage-400" size={32} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-warmgray-900 mb-2">
          Thanks for checking in
        </h2>
        <p className="text-warmgray-500 mb-8">
          Taking a moment to notice how you feel is a small but powerful thing.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(ROUTES.CHAT)}>
            <MessageCircle size={16} /> Talk about it
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-lg mx-auto py-8"
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i <= step ? 'bg-lavender-500' : 'bg-lavender-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-heading font-bold text-warmgray-900 mb-2">
              How are you feeling right now?
            </h2>
            <p className="text-warmgray-500 mb-10">Be honest — there are no wrong answers.</p>

            <div className={`inline-flex flex-col items-center p-8 rounded-card transition-colors duration-500 ${getMoodColor()}`}>
              <span className="text-6xl mb-4">{getMoodFace()}</span>
              <p className="font-heading font-bold text-warmgray-900 text-lg mb-1">{rating}/10</p>
              <p className="text-sm text-warmgray-600">{MOOD_LABELS[rating]}</p>
            </div>

            <div className="mt-8 px-4">
              <input
                type="range"
                min={1}
                max={10}
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                  bg-gradient-to-r from-rose-200 via-amber-200 to-sage-200
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-lavender-500
                  [&::-webkit-slider-thumb]:shadow-button
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:duration-200
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between mt-2 text-xs text-warmgray-400">
                <span>Struggling</span>
                <span>Wonderful</span>
              </div>
            </div>

            <div className="mt-10">
              <Button onClick={() => setStep(1)}>
                Next <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="emotions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-heading font-bold text-warmgray-900 mb-2">
              Any of these resonate?
            </h2>
            <p className="text-warmgray-500 mb-8">Pick as many as feel right.</p>

            <div className="flex flex-wrap justify-center gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => toggleEmotion(emotion.name)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-200
                    ${selectedEmotions.includes(emotion.name)
                      ? 'bg-lavender-500 text-white shadow-button'
                      : 'bg-white border border-lavender-200 text-warmgray-600 hover:border-lavender-300'
                    }
                  `}
                >
                  {emotion.emoji} {emotion.name}
                </button>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button onClick={() => setStep(2)}>
                Next <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="note"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-heading font-bold text-warmgray-900 mb-2">
              Anything else on your mind?
            </h2>
            <p className="text-warmgray-500 mb-8">Totally optional — just if you want to jot something down.</p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Whatever comes to mind..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-card
                text-warmgray-700 placeholder:text-warmgray-400
                focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent
                transition-all duration-200 resize-none font-accent text-lg"
            />

            <div className="mt-10 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button onClick={handleComplete} loading={submitting}>
                Done <Check size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
