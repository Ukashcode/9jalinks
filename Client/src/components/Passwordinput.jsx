import { useState } from 'react';

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M3 3l18 18M10.6 10.6a2.5 2.5 0 003.5 3.5M6.5 6.7C4 8.3 2 12 2 12s3.5 7 10 7c1.9 0 3.5-.5 4.9-1.2M9.9 4.2A9.7 9.7 0 0112 4c6.5 0 10 8 10 8a15.6 15.6 0 01-3 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

const RequirementIcon = ({ passed }) => (
  <span
    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
      passed ? 'bg-success-500' : 'bg-primary-100'
    }`}
  >
    {passed && (
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
        <path
          d="M2 6l2.5 2.5L10 3"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </span>
);

// A password field with a show/hide toggle, and an optional live checklist
// of requirements (each with a label + a test function run against value).
// Pass `requirements` only on the primary password field — leave it off
// for a plain confirm-password field.
const PasswordInput = ({ id, name, label, value, onChange, error, requirements, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-body text-sm font-medium text-primary-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 font-body text-ink outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
            error ? 'border-red-400' : 'border-primary-100'
          }`}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-500 transition-colors hover:text-primary-900"
        >
          <EyeIcon open={visible} />
        </button>
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}

      {requirements && (
        <ul className="mt-1 flex flex-col gap-1.5">
          {requirements.map((req) => {
            const passed = req.test(value);
            return (
              <li
                key={req.label}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  passed ? 'text-success-700' : 'text-primary-500'
                }`}
              >
                <RequirementIcon passed={passed} />
                {req.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PasswordInput;