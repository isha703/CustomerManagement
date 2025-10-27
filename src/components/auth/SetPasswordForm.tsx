import React, { useState } from "react";
import Button from "../ui/Button";
import Captcha from "./Captcha";
import { BACKEND_ORIGIN,AES_SECRET } from '../../features/auth/common/constants';
import { encryptPayload } from "../../utils/jwt";

interface Props {
  email: string;
  onSuccess: () => void;
}

const SetPasswordForm: React.FC<Props> = ({ email, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (!captchaValid) {
    setError("CAPTCHA is incorrect. Please try again.");
    return;
  }

  try {
    const payload = password ;
    const encryptedPayload = await encryptPayload(payload, AES_SECRET);

    const res = await fetch(`${BACKEND_ORIGIN}/api/auth/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, data: encryptedPayload }),
    });

    if (!res.ok) throw new Error("Failed to set password");
    onSuccess();
  } catch (err) {
    setError("Error while setting password. Please try again.");
    console.error(err);
  }
};


  return (
    <div className="max-w-sm mx-auto mt-12 p-5 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">
        Set Your Password
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full mt-1 p-2 text-sm border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 text-sm border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mt-1 p-2 text-sm border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">CAPTCHA</label>
          <Captcha
            length={6}
            onValidityChange={(valid) => setCaptchaValid(valid)}
            onValueChange={(val) => setCaptchaValue(val)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mt-1">{error}</p>
        )}

        <div className="flex justify-center mt-2">
          <Button
            type="submit"
            className="text-sm px-4 py-1 rounded-md shadow-sm hover:shadow-md"
          >
            Set Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SetPasswordForm;
