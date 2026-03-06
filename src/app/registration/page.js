"use client";

import { useRouter } from "next/navigation"; //next/navigation
import Registration from "../components/auth/Registration";

export default function RegistrationPage() {
  const router = useRouter();

  // Callback after login
  const handleLogin = (data) => {
    console.log("Registration successful:", data);
    // Redirect to Verification page
    router.push("/verification");
  };

  const switchToLogin = () => {
    router.push("/login"); // if you have a register page
  };

  return (
    <Registration onRegister={handleLogin} onSwitchToLogin={switchToLogin} />
  );
}