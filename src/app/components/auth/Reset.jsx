"use client";

import { useState } from "react";
import axios from "axios";
import { GraduationCap, Lock, Mail } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { useRouter } from "next/navigation";

export default function ResetPassword({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);

  const router = useRouter();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors({});
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.otp.trim()) newErrors.otp = "OTP is required";
    if (!formData.newPassword.trim()) newErrors.newPassword = "New password is required";
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        otp: formData.otp.trim(),
        email: sessionStorage.getItem("temp_email"),
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      };

      const response = await axios.post(
        "https://vaalsetaapi-7hrsa.ondigitalocean.app/api/students/reset-pass",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(response.data.message || "Password reset successfully!");
      console.log("Reset Password response:", response.data);

      // Redirect to login after a short delay
      setTimeout(() => router.push("/login"), 2000);

    } catch (err) {
      console.error("Reset Password error:", err);
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
                  src="https://res.cloudinary.com/dbuuizuka/image/upload/v1761697835/id3tj44Wsz_1761674029816_z2fjde.png"
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
            Reset Password
          </h1>
          <p className="text-gray-600">Enter OTP sent to your email and choose a new password</p>
        </div>

        {/* Error / Success */}
        {error && <p className="text-sm text-center mb-4" style={{ color: COLORS.danger }}>{error}</p>}
        {success && <p className="text-sm text-center mb-4" style={{ color: COLORS.success }}>{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">OTP</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => handleChange("otp", e.target.value)}
                placeholder="Enter OTP"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.otp ? COLORS.danger : COLORS.border }}
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.newPassword ? COLORS.danger : COLORS.border }}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.confirmPassword ? COLORS.danger : COLORS.border }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remembered your password?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-semibold hover:underline"
              style={{ color: COLORS.primary }}
            >
              Login here
            </button>
          </p>
          {onSwitchToLogin && (
            <p className="text-gray-600 mt-2">
              Need to register?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold hover:underline"
                style={{ color: COLORS.primary }}
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}