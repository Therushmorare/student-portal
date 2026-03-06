"use client";

import { useState } from "react";
import axios from "axios";
import { GraduationCap, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { useRouter } from "next/navigation";

const Registration = ({ onRegister, onSwitchToLogin }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    faculty: "Engineering and Technology",
    programme: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);

  const faculties = [
    "Engineering and Technology",
    "Business and Economics",
    "Health Sciences",
    "Humanities",
    "Natural Sciences"
  ];

  const programmes = {
    "Engineering and Technology": ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    "Business and Economics": ["Business Administration", "Economics", "Accounting"],
    "Health Sciences": ["Nursing", "Medicine", "Pharmacy"],
    "Humanities": ["Psychology", "Education", "Social Work"],
    "Natural Sciences": ["Mathematics", "Physics", "Chemistry"]
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.idNumber.trim()) newErrors.idNumber = "ID number is required";
    else if (formData.idNumber.length !== 13) newErrors.idNumber = "ID number must be 13 digits";
    if (!formData.studentNumber.trim()) newErrors.studentNumber = "Student number is required";
    if (!formData.programme) newErrors.programme = "Programme is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        id_number: formData.idNumber,
        faculty: formData.faculty,
        programme: formData.programme,
        password: formData.password,
        student_number: formData.studentNumber
      };

      const response = await axios.post(
        "https://seta-api-3g5xl.ondigitalocean.app/api/students/signup",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const { message } = response.data;

      setApiSuccess(message || "Signup successful!");
      if (onRegister) onRegister(response.data);

      sessionStorage.setItem("email", formData.email);

      router.push("/verification");
    } catch (err) {
      console.error("Signup error:", err);
      setApiError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-8" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="text-center mb-8">
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>Student Registration</h1>
          <p className="text-gray-600">Create your student portal account</p>
        </div>

        {apiError && <p className="text-red-500 text-sm mb-2">{apiError}</p>}
        {apiSuccess && <p className="text-green-500 text-sm mb-2">{apiSuccess}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.firstName ? COLORS.danger : COLORS.border }}
              />
              {errors.firstName && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.lastName ? COLORS.danger : COLORS.border }}
              />
              {errors.lastName && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.email ? COLORS.danger : COLORS.border }}
                />
              </div>
              {errors.email && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.phone ? COLORS.danger : COLORS.border }}
                  placeholder="+27 12 345 6789"
                />
              </div>
              {errors.phone && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.phone}</p>}
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">ID Number *</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={e => handleChange("idNumber", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.idNumber ? COLORS.danger : COLORS.border }}
                maxLength="13"
                placeholder="0012315678912"
              />
              {errors.idNumber && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.idNumber}</p>}
            </div>

            {/* Student Number */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Student Number *</label>
                <input
                type="text"
                value={formData.studentNumber}
                onChange={e => handleChange("studentNumber", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.studentNumber ? COLORS.danger : COLORS.border }}
                maxLength="15"
                placeholder="2134665542"
              />
              {errors.studentNumber && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.studentNumber}</p>}
            </div>

            {/* Faculty */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Faculty *</label>
              <select
                value={formData.faculty}
                onChange={e => {
                  handleChange("faculty", e.target.value);
                  handleChange("programme", "");
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              >
                {faculties.map(fac => <option key={fac} value={fac}>{fac}</option>)}
              </select>
            </div>

            {/* Programme */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Programme *</label>
              <select
                value={formData.programme}
                onChange={e => handleChange("programme", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.programme ? COLORS.danger : COLORS.border }}
              >
                <option value="">Select Programme</option>
                {programmes[formData.faculty]?.map(prog => <option key={prog} value={prog}>{prog}</option>)}
              </select>
              {errors.programme && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.programme}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={e => handleChange("password", e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.password ? COLORS.danger : COLORS.border }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={e => handleChange("confirmPassword", e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.confirmPassword ? COLORS.danger : COLORS.border }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold hover:underline"
              style={{ color: COLORS.primary }}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;