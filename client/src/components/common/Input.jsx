import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-bg border ${error ? 'border-error' : 'border-transparent'} rounded focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
});

export default Input;
