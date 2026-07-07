const variants = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  error: 'bg-error/10 text-error',
  accent: 'bg-accent/10 text-accent',
  muted: 'bg-bg text-text-muted',
};

const Badge = ({ variant = 'primary', children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
