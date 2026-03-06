"use client";

import { useRouter } from "next/navigation"; //next/navigation
import Login from "../components/auth/Login";

export default function LoginPage() {
  const router = useRouter();

  // Callback after login
  const handleLogin = (data) => {
    console.log("Login successful:", data);
    // Redirect to MFA page
    router.push("/mfa");
  };

  const switchToRegister = () => {
    router.push("/registration");
  };

  const switchToForgotPassword = () => {
    router.push("/forgot");
  };

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={switchToRegister}
      onSwitchToForgotPassword={switchToForgotPassword}
    />
  );
}
