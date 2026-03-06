"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, Lock, RefreshCw } from "lucide-react";
import { COLORS } from "../../constants/colors";

export default function Verify({ onVerify }) {
  const [form, setForm] = useState({ mfa_code: "" });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  const email =
    typeof window !== "undefined"
      ? sessionStorage.getItem("email")
      : null;

  /* ================= COOLDOWN TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mfa_code.trim()) {
      setError("Verification code is required");
      return;
    }

    if (!email) {
      setError("Cannot verify: No email found.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        email,
        token: form.mfa_code.trim(),
      };

      const res = await axios.post(
        "https://seta-api-3g5xl.ondigitalocean.app/api/students/verify-token",
        payload
      );

      setSuccess(res.data.message || "Account verified successfully");
      onVerify?.(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND TOKEN ================= */
  const handleResend = async () => {
    if (!email) {
      setError("Cannot resend token: No email found.");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "https://seta-api-3g5xl.ondigitalocean.app/api/students/resend-token",
        { email }
      );

      setSuccess(res.data.message || "Verification code resent");
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend token");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.bgLight }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        {/* ================= HEADER ================= */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {imageLoaded ? (
              <img
                src="https://res.cloudinary.com/dbuuizuka/image/upload/v1772775906/Logo-HWSETA_vaice1.png"
                alt="Graduation Cap"
                className="w-20 h-20 object-contain"
                onError={() => setImageLoaded(false)}
              />
            ) : (
              <GraduationCap
                className="w-16 h-16"
                style={{ color: COLORS.primary }}
              />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            Account Verification
          </h1>
          <p className="text-gray-600">
            Enter the code sent to <strong>{email}</strong>
          </p>
        </div>

        {/* ================= FEEDBACK ================= */}
        {error && (
          <p className="text-sm text-center mb-4" style={{ color: COLORS.danger }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-center mb-4" style={{ color: COLORS.success }}>
            {success}
          </p>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Verification Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.mfa_code}
                onChange={(e) => handleChange("mfa_code", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Enter verification code"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* ================= RESEND ================= */}
        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex items-center justify-center gap-2 text-sm font-medium mx-auto"
            style={{
              color:
                resending || cooldown > 0
                  ? COLORS.border
                  : COLORS.primary,
            }}
          >
            <RefreshCw className="w-4 h-4" />
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
              ? "Resending..."
              : "Resend verification code"}
          </button>
        </div>
      </div>
    </div>
  );
}