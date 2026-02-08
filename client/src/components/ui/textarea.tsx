import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-warmgray-700 font-heading">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-white border border-lavender-200 rounded-input
            text-warmgray-700 placeholder:text-warmgray-400
            focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent
            transition-all duration-200 resize-none
            ${error ? 'border-rose-400 focus:ring-rose-300' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
