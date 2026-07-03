const VARIANTS = {
  primary: 'bg-primary-700 text-white hover:bg-primary-900',
  accent: 'bg-accent-500 text-primary-900 hover:bg-accent-700',
  outline: 'border border-primary-700 text-primary-700 hover:bg-primary-50',
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`rounded-lg px-5 py-2.5 font-body font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;