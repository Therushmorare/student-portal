"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { COLORS } from "../../constants/colors";

const API_BASE = "https://seta-api-3g5xl.ondigitalocean.app";

const apiToForm = (data) => ({
  dateOfBirth: data?.date_of_birth ?? "",
  gender: data?.gender?.toLowerCase() ?? "",
  address: data?.address ?? "",
});

const formToApi = (userId, formData) => ({
  user_id: userId,
  dob: formData.dateOfBirth,
  gender: formData.gender,
  address: formData.address.trim(),
});

const StudentBiographic = ({ student, showToast }) => {
  const userId = student?.user_id || student?.id;

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /* ================= FETCH BIOGRAPHICAL DATA ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchBio = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/students/biographical/${userId}`
        );

        console.log("GET biographical:", res.data);
        setFormData(apiToForm(res.data));
      } catch (err) {
        console.warn("No existing biographical data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBio();
  }, [userId]);

  /* ================= HANDLERS ================= */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const payload = formToApi(userId, formData);
    console.log("POST payload:", payload);

    try {
      const res = await axios.post(
        `${API_BASE}/api/students/biographical`,
        payload
      );

      console.log("POST response:", res.data);

      showToast?.("Biographical details saved successfully", "success");
    } catch (err) {
      console.error("POST error:", err.response?.data || err);

      const message =
        err.response?.data?.message || "Failed to save biographical details";
      showToast?.(message, "error");

      // Optional: map backend field errors if they exist
      if (err.response?.data?.errors) {
        const backendErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          if (key === "dob") backendErrors.dateOfBirth = value;
          if (key === "gender") backendErrors.gender = value;
          if (key === "address") backendErrors.address = value;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <p>Loading biographical data...</p>;

  return (
    <div className="space-y-6">
      <Section
        title="Biographical Details"
        action={
          <SuccessButton onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </SuccessButton>
        }
      >
        <Grid>
          <Field label="Date of Birth" error={errors.dateOfBirth}>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </Field>

          <Field label="Gender" error={errors.gender}>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Address" error={errors.address} full>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </Field>
        </Grid>
      </Section>
    </div>
  );
};

/* ================= UI HELPERS ================= */
const Section = ({ title, action, children }) => (
  <div className="rounded-lg p-6 shadow-sm bg-white">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

const Field = ({ label, error, children, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {children}
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

const SuccessButton = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 rounded-lg text-white disabled:opacity-60"
    style={{ backgroundColor: COLORS.success }}
  >
    {children}
  </button>
);

export default StudentBiographic;