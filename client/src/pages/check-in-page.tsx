import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, MessageCircle } from 'lucide-react';
import Button from '../components/ui/button';
import { emotions } from '../config/emotions';
import { moodLabels } from '../config/constants';
import apiClient from '../config/api-client';

// positive quotes for the thank you screen
const thankYouQuotes = [
  "Every day is a fresh start. You're doing amazing.",
  "Taking time to reflect shows real strength.",
  "Small steps lead to big changes. Keep going.",
  "You matter, and so do your feelings.",
  "Be gentle with yourself today.",
];

export default function CheckInPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rating, setRating] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMoreEmotions, setShowMoreEmotions] = useState(false);
  // pick a random quote
  const [quote] = useState(thankYouQuotes[Math.floor(Math.random() * thankYouQuotes.length)]);

  const toggleEmotion = (name: string) => {
    if (selectedEmotions.includes(name)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== name));
    } else {
      setSelectedEmotions([...selectedEmotions, name]);
    }
  };

  // get mood face emoji based on rating
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
    } catch {
      // still show thank you even if it fails
    }
    setSubmitting(false);
    setShowThankYou(true);
  };

  // auto redirect after thank you screen
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => navigate('/dashboard'), 4000);
      return () => clearTimeout(timer);
    }
  }, [showThankYou, navigate]);

  // which emotions to show
  const visibleEmotions = showMoreEmotions ? emotions : emotions.slice(0, 12);

  // thank you screen with animation
  if (showThankYou) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-6xl mb-6">🎈</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">That's great!</h2>
        <p className="text-gray-500 mb-4 max-w-sm mx-auto italic font-accent text-lg">"{quote}"</p>
        <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button onClick={() => navigate('/chat')}>
            <MessageCircle size={16} /> Talk to Luna
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      {/* progress steps */}
      <div className="flex justify-center items-center gap-3 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i === step
                ? 'bg-[#7E57C2] text-white'
                : i < step
                  ? 'bg-[#7E57C2] text-white opacity-60'
                  : 'bg-[#EDE5FF] text-[#7E57C2]'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* step 1: mood rating */}
      {step === 0 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling right now?</h2>
          <p className="text-gray-500 mb-10">Be honest</p>

          <div className="inline-flex flex-col items-center p-8 rounded-2xl" style={{ backgroundColor: rating <= 3 ? '#FFE4E9' : rating <= 6 ? '#FFF8E1' : '#E8F5E9' }}>
            <span className="text-6xl mb-4">{getMoodFace()}</span>
            <p className="font-bold text-gray-900 text-lg">{rating}/10</p>
            <p className="text-sm text-gray-600">{moodLabels[rating]}</p>
          </div>

          <div className="mt-8 px-4">
            <input
              type="range"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #FFE4E9, #FFF8E1, #E8F5E9)' }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Not at all</span>
              <span>Very</span>
            </div>
          </div>

          <div className="mt-10">
            <Button onClick={() => setStep(1)}>Next <ArrowRight size={16} /></Button>
          </div>
        </div>
      )}

      {/* step 2: emotions */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How would you describe how you're feeling today?</h2>
          <p className="text-gray-500 mb-8">You may pick multiple</p>

          <div className="grid grid-cols-2 gap-3">
            {visibleEmotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => toggleEmotion(emotion.name)}
                className={`py-4 px-6 rounded-2xl text-base font-semibold transition-colors ${
                  selectedEmotions.includes(emotion.name)
                    ? 'bg-[#2D2A2A] text-white'
                    : 'bg-white border border-gray-200 text-gray-800 hover:border-[#D4C4F5]'
                }`}
              >
                {emotion.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMoreEmotions(!showMoreEmotions)}
            className="mt-4 px-6 py-2 text-sm text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            {showMoreEmotions ? 'Show less' : 'Show more emotions'}
          </button>

          <div className="mt-8 flex justify-center gap-3">
            <Button variant="ghost" onClick={() => setStep(0)}><ArrowLeft size={16} /> Back</Button>
            <Button onClick={() => setStep(2)}>Next <ArrowRight size={16} /></Button>
          </div>
        </div>
      )}

      {/* step 3: optional note */}
      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Anything else on your mind?</h2>
          <p className="text-gray-500 mb-8">Totally optional.</p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Whatever comes to mind..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-[#D4C4F5] rounded-2xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B39DDB] resize-none"
          />

          <div className="mt-8 flex justify-center gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</Button>
            <Button onClick={handleComplete} loading={submitting}>Done <Check size={16} /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
