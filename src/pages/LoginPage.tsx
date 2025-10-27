import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import SetPasswordForm from "../components/auth/SetPasswordForm";
import Modal from "../components/ui/Modal";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { showToast } from "../utils/toast";

const CustomerImage: string = require("../assets/images/Customer-Management.jpg");

const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [emailForSetPassword, setEmailForSetPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const handlePasswordRequired = (email: string) => {
    setEmailForSetPassword(email);
    setShowSetPassword(true);
  };

  const handlePasswordSetSuccess = () => {
    setShowSetPassword(false);
    showToast("Password set successfully! You can now log in.", "success");
  };

  const handleForgotPasswordClick = () => {
    if (!loginEmail.trim()) {
      showToast("Please enter your email before resetting the password.", "error");
      return;
    }
    setEmailForSetPassword(loginEmail);
    setShowSetPassword(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={CustomerImage}
          alt="Customer Management"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-6 bg-gradient-to-r from-transparent to-blue-300 relative">
        {/* Blur background when modal is open */}
        <div
          className={`w-full max-w-md p-8 bg-white rounded-lg shadow-lg transition-all duration-300 ${
            showRegister || showSetPassword ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome back
          </h1>
          <p className="text-gray-500 mb-6 text-center">
            Please enter your details
          </p>

          <LoginForm
            onPasswordRequired={handlePasswordRequired}
            onEmailChange={setLoginEmail}
          />

          {/* OR Separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex justify-center">
            <GoogleSignInButton />
          </div>

          {/* Forgot Password */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <button
              onClick={handleForgotPasswordClick}
              className={`hover:underline ${
                loginEmail ? "text-blue-500" : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!loginEmail}
            >
              Forgot password?
            </button>
          </div>

          {/* Register link */}
        
        </div>

        {/* Register Modal */}
        <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
          <RegisterForm />
        </Modal>

        {/* Set Password Modal */}
        <Modal isOpen={showSetPassword} onClose={() => setShowSetPassword(false)}>
          <SetPasswordForm
            email={emailForSetPassword}
            onSuccess={handlePasswordSetSuccess}
          />
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
