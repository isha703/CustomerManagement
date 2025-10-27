import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthConfig from "../features/auth/hooks/useAuthConfig";
import { decryptAesGcmEncoded } from "../utils/crypto";
import { BACKEND_ORIGIN } from '../features/auth/common/constants';
const OAuthCallback: React.FC = () => {
  const { setNewUser } = useAuthConfig();
  const navigate = useNavigate();

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_ORIGIN}/api/auth/me`, {
          withCredentials: true,
        });

        const enc = res.data?.enc;
        if (!enc) throw new Error("Missing encrypted payload from backend");

        const secret = process.env.REACT_APP_AES_SECRET as string;
        if (!secret) throw new Error("AES secret not defined in env");

        const user = await decryptAesGcmEncoded(enc, secret);
        setNewUser(user);

        navigate("/dashboard");
      } catch (err) {
        console.error("OAuth callback failed:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [setNewUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-700 text-lg font-medium">
        Completing sign-in…
      </div>
    </div>
  );
};

export default OAuthCallback;
