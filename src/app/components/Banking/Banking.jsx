"use client";

import { useEffect, useState } from "react";
import { Landmark, Hash, AlertCircle, CheckCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";

const StudentBankingProfile = ({ student, onUpdate, showToast }) => {
  const [form, setForm] = useState({
    bankName: "",
    accountType: "",
    accountNumber: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  /* ---------------- Fetch existing banking details ---------------- */
  useEffect(() => {
    if (!student?.id) return;

    const fetchBankingDetails = async () => {
      setAlert(null);
      try {
        const res = await fetch(
          `https://seta-api-3g5xl.ondigitalocean.app/api/students/bankingDetails/${student.id}`
        );

        if (res.status === 404) {
          setHasExisting(false);
          return;
        }

        if (!res.ok) {
          setAlert({
            type: "error",
            message: "Unable to load banking details. Please try again later."
          });
          return;
        }

        const data = await res.json();

        setForm({
          bankName: data.bank_name || "",
          accountType: data.account_type || "",
          accountNumber: data.account_number || ""
        });

        setHasExisting(true);

      } catch (err) {
        console.error(err);
        setAlert({
          type: "error",
          message: "Network error while loading banking details."
        });
      }
    };

    fetchBankingDetails();
  }, [student?.id]);

  /* ---------------- Handle input changes ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  /* ---------------- Validation ---------------- */
  const validate = () => {
    const errors = {};
    if (!form.bankName.trim()) errors.bankName = "Bank name is required";
    if (!form.accountType) errors.accountType = "Account type is required";
    if (!form.accountNumber.trim()) errors.accountNumber = "Account number is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ---------------- Save (Create or Update) ---------------- */
  const handleSave = async () => {
    setAlert(null);

    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the errors below and try again." });
      return;
    }

    setLoading(true);

    const payload = {
      user_id: student.id,
      bank_name: form.bankName.trim(),
      account_type: form.accountType,
      account_number: form.accountNumber.trim()
    };

    try {
      const endpoint = hasExisting
        ? "https://seta-api-3g5xl.ondigitalocean.app/api/students/banking-details/update"
        : "https://seta-api-3g5xl.ondigitalocean.app/api/students/banking-details";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: "error", message: data.message || "Failed to save banking details." });
        return;
      }

      setHasExisting(true);
      onUpdate?.(payload);
      setAlert({ type: "success", message: "Banking details saved successfully." });

    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Network error while saving details." });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Banking Details</h2>

        {/* Inline Alert */}
        {alert && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
              alert.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {alert.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {alert.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <div className="relative">
              <Landmark className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none ${fieldErrors.bankName ? "border-red-500" : ""}`}
              />
            </div>
            {fieldErrors.bankName && <p className="mt-1 text-sm text-red-600">{fieldErrors.bankName}</p>}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Account Type</label>
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.accountType ? "border-red-500" : ""}`}
            >
              <option value="">Select account type</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="transmission">Transmission</option>
            </select>
            {fieldErrors.accountType && <p className="mt-1 text-sm text-red-600">{fieldErrors.accountType}</p>}
          </div>

          {/* Account Number */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${fieldErrors.accountNumber ? "border-red-500" : ""}`}
              />
            </div>
            {fieldErrors.accountNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.accountNumber}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBankingProfile;