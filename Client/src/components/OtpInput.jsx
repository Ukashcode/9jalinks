import { useRef } from 'react';

// Renders 6 separate boxes but behaves as one value. Typing a digit
// auto-advances focus to the next box; backspace on an empty box moves
// focus back; pasting a full 6-digit code fills every box at once.
const OtpInput = ({ value, onChange, length = 6 }) => {
  const inputsRef = useRef([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const setDigit = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(''));
  };

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted.padEnd(length, '').slice(0, length));
      inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-14 w-12 rounded-lg border border-primary-100 text-center font-display text-xl font-bold text-primary-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      ))}
    </div>
  );
};

export default OtpInput;