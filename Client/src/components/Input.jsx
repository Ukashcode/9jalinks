const Input = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-body text-sm font-medium text-primary-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border px-3.5 py-2.5 font-body text-ink outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
          error ? 'border-red-400' : 'border-primary-100'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;