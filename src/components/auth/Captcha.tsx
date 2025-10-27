// ...existing code...
import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface CaptchaProps {
  length?: number;
  onValidityChange?: (valid: boolean) => void;
  onValueChange?: (value: string) => void;
  // backward compatibility
  onChange?: (value: string, valid: boolean) => void;
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '$5@!';

function randomChar(set: string) {
  return set[Math.floor(Math.random() * set.length)];
}

function generateCaptcha(len: number) {
  const result: string[] = [];
  // guarantee at least one of each required type
  result.push(randomChar(UPPER));
  result.push(randomChar(DIGITS));
  result.push(randomChar(SPECIAL));
  const all = UPPER + DIGITS + SPECIAL;
  while (result.length < len) result.push(randomChar(all));
  // shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.join('');
}

const Captcha: React.FC<CaptchaProps> = ({ length = 6, onValidityChange, onValueChange, onChange }) => {
  const [captcha, setCaptcha] = useState<string>(() => generateCaptcha(length));
  const [input, setInput] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    const isValid = input.trim().toUpperCase() === captcha.toUpperCase();
    setValid(isValid);
    onValidityChange?.(isValid);
    onValueChange?.(input);
    onChange?.(input, isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, captcha]);

  const refresh = () => {
    setCaptcha(generateCaptcha(length));
    setInput('');
    setValid(false);
    onValidityChange?.(false);
    onValueChange?.('');
    onChange?.('', false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-3">
          <div
          aria-label="captcha"
          className="bg-blue-100 italic font-bold text-lg px-4 py-2 rounded shadow-sm tracking-widest select-all"
        >
          {captcha}
        </div>

        <button
          type="button"
          onClick={refresh}
          title="Refresh captcha"
          className="p-2 rounded hover:bg-gray-100"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          aria-label="Enter captcha"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Enter captcha"
        />
        <div className="w-6 h-6 flex items-center justify-center">
          {input.length === 0 ? null : valid ? (
            <CheckCircle color="green" />
          ) : (
            <XCircle color="red" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Captcha;