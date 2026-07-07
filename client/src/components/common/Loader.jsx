const Loader = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
    </div>
  );
};

export default Loader;
