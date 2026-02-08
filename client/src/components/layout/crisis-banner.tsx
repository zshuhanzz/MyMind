import { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { CRISIS_RESOURCES } from '../../config/constants';

export default function CrisisBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-rose-100 border-b border-rose-200">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-warmgray-700 hover:text-warmgray-900 transition-colors"
        >
          <Heart size={14} className="text-rose-400" />
          <span>
            If you're in crisis, help is available.{' '}
            <strong className="text-rose-400">Call or text 988</strong>
          </span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CRISIS_RESOURCES.map((resource) => (
              <div
                key={resource.name}
                className="flex items-start gap-3 p-3 bg-white/60 rounded-card"
              >
                <Phone size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-heading font-semibold text-sm text-warmgray-900">
                    {resource.name}
                  </p>
                  <p className="text-sm text-warmgray-600">{resource.action}</p>
                  <p className="text-xs text-warmgray-400">{resource.available}</p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-lavender-500 hover:text-lavender-600 underline"
                    >
                      Visit website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
