const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  required = false,
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-clinical-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg diagnostic-input
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-clinical-300 focus:border-primary-500 focus:ring-primary-200'
          }
          focus:outline-none focus:ring-2 transition-colors duration-200
          bg-white text-clinical-900 placeholder-clinical-500
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;