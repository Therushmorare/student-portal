"use client";

import { useRouter } from "next/navigation"; //next/navigation
import Verify from "../components/auth/Verify";

export default function MFAPage() {
  const router = useRouter();

  const handleVerify = (data) => {
    console.log("Account Verified:", data);
    // Redirect to dashboard after MFA
    router.push("/login");
  };

  return <Verify onVerify={handleVerify} />;
}