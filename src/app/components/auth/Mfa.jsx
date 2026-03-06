"use client";

import { useState } from "react";
import axios from "axios";
import { GraduationCap, Lock } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { useRouter } from "next/navigation";

export default function MFA({ onVerify }) {
  const [form, setForm] = useState({ mfa_code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mfa_code.trim()) {
      setError("MFA code is required");
      return;
    }

    setLoading(true);

    try {
      const payload = { mfa_code: form.mfa_code.trim() };

      const response = await axios.post(
        "https://seta-api-3g5xl.ondigitalocean.app/api/students/verify-mfa",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(response.data.message || "MFA verified!");
      console.log("MFA Response:", response.data);

      if (onVerify) onVerify(response.data);
      router.push("/dashboard"); 

    } catch (err) {
      console.error("MFA error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {imageLoaded ? (
              <div className="flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dbuuizuka/image/upload/v1772775906/Logo-HWSETA_vaice1.png"
                  alt="Graduation Cap"
                  className="w-20 h-20 object-contain"
                  onError={() => setImageLoaded(false)}
                />
              </div>
            ) : (
              <GraduationCap
                className="w-16 h-16"
                style={{ color: COLORS.primary }}
              />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            MFA Verification
          </h1>
          <p className="text-gray-600">Enter the code sent to your email</p>
        </div>

        {/* Error / Success */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              MFA Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="mfa_code"
                value={form.mfa_code}
                onChange={(e) => handleChange("mfa_code", e.target.value)}
                placeholder="Enter MFA Code"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: error ? COLORS.danger : COLORS.border }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}