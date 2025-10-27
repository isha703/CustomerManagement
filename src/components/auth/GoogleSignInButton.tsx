import React from 'react';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../features/auth/authAPI';
import { setUser } from '../../features/auth/authSlice';
import Button from '../ui/Button';
import GoogleIcon from '../../assets/images/google-icon.svg';
const GoogleSignInButton: React.FC = () => {
   

    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
     <Button
      onClick={handleGoogleSignIn}
      aria-label="Sign in with Google"
      className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white text-gray-700 shadow-sm hover:shadow-md transform transition duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white border">
        <img
          src={GoogleIcon}
          alt="Google"
          className="w-5 h-5 object-contain"
        />
      </span>
      <span className="font-medium">Sign in with Google</span>
    </Button>
  );
};

export default GoogleSignInButton;