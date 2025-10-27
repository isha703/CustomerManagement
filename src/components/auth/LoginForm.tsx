import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SetPasswordForm from "./SetPasswordForm";
import Button from "../ui/Button";
import { BACKEND_ORIGIN,AES_SECRET } from '../../features/auth/common/constants';
import { encryptPayload } from "../../utils/jwt";
import useAuthConfig from "../../features/auth/hooks/useAuthConfig";
import { decryptAesGcmEncoded } from "../../utils/crypto";

interface LoginFormProps {
  onPasswordRequired: (email: string) => void;
    onEmailChange?: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onPasswordRequired, onEmailChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSetPassword, setShowSetPassword] = useState(false);
  const navigate = useNavigate();
    const { setNewUser } = useAuthConfig();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const payload = password;
    const encryptedPayload = await encryptPayload(payload, AES_SECRET);

    const res = await fetch(`${BACKEND_ORIGIN}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, data: encryptedPayload }),
      
    });

    const data = await res.json();

    if (data.error === "account_password_required") {
     // setShowSetPassword(true);
      onPasswordRequired(email);
      return;
    }

    if (!res.ok) throw new Error("Login failed");

 if (data.user) {
  setNewUser(data.user);
  console.log("Logged-in user:", data.user);
}

// ✅ Redirect after login
navigate("/dashboard");

  } catch (err) {
    showToast("Invalid credentials", "error");
    console.error("Login error:", err);
  }
};



//   if (showSetPassword) {
//     return <SetPasswordForm email={email} onSuccess={() => navigate("/dashboard")} />;
//   }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
     <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    onEmailChange?.(e.target.value); 
  }}
  required
  className="w-full mt-1 p-2 text-sm border border-gray-300 rounded"
/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
function showToast(message: string, type: "success" | "error" | "info" = "info") {
    if (typeof document === "undefined") return;

    const containerId = "app-toast-container";
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        Object.assign(container.style, {
            position: "fixed",
            right: "16px",
            bottom: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: "9999",
            pointerEvents: "none",
        });
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.setAttribute("role", "status");
    Object.assign(toast.style, {
        pointerEvents: "auto",
        minWidth: "200px",
        maxWidth: "320px",
        padding: "10px 14px",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        opacity: "0",
        transform: "translateY(8px)",
        transition: "opacity 200ms ease, transform 200ms ease",
        fontSize: "14px",
    });

    // simple color scheme by type
    if (type === "success") {
        toast.style.background = "#16a34a"; // green
    } else if (type === "error") {
        toast.style.background = "#dc2626"; // red
    } else {
        toast.style.background = "#2563eb"; // blue/info
    }

    container.appendChild(toast);

    // entrance
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    // auto-dismiss
    const DURATION = 4000;
    const fadeOut = () => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        setTimeout(() => toast.remove(), 200);
    };

    const timeout = setTimeout(fadeOut, DURATION);

    // allow click to dismiss immediately
    toast.addEventListener("click", () => {
        clearTimeout(timeout);
        fadeOut();
    });
}


