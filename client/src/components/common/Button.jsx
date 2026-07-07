const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark border-primary',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-text-muted hover:text-text hover:bg-bg',
  danger: 'bg-error text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
