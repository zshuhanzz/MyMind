interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export default function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-300
          ${enabled ? 'bg-lavender-500' : 'bg-warmgray-300'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5
            w-5 h-5 bg-white rounded-full shadow-sm
            transition-transform duration-200
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span className="text-sm text-warmgray-700">{label}</span>
      )}
    </label>
  );
}
