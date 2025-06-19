"use client"

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import AuthModal from "./components/ui/AuthModal/AuthModal";
import SignupForm from "./components/auth/SignupForm/SignupForm";
import LoginForm from "./components/auth/LoginForm/LoginForm";
import { useState } from "react";

export default function HomePage() {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const handleOpenSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };
  const handleCloseSignup = () => setSignupModalOpen(false);
  const handleOpenLogin = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  }
  const handleCloseLogin = () => setLoginModalOpen(false);

  const handleSwitchToLogin = () => {
    handleCloseSignup();
    setLoginModalOpen(true);
  };

  return (
    <main>
      <Header />
      <Hero
        onSignupClick={handleOpenSignup}
        onLoginClick={handleOpenLogin}
      />

      {isSignupModalOpen && (
        <AuthModal
          title="Signup"
          onClose={handleCloseSignup}
          secondaryActionText="Already have an account?"
          secondaryActionLinkText="Login"
          onSecondaryAction={handleSwitchToLogin}
        >
          <SignupForm />
        </AuthModal>
      )}

      {isLoginModalOpen && (
        <AuthModal
          title="Login"
          onClose={handleCloseLogin}
          secondaryActionText="Create a new account"
          secondaryActionLinkText=""
          onSecondaryAction={handleOpenSignup}
        >
          <LoginForm />
        </AuthModal>
      )}
    </main>
  );
}