"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { useRouter } from "next/navigation";

// Simple date formatter
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const StudentAcademics = ({ student }) => {
  const [formData, setFormData] = useState({
    studentNumber: "",
    faculty: "",
    programme: "",
    registrationDate: "",
    status: "",
  });

  // Populate data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        studentNumber: student.studentNumber || "",
        faculty: student.faculty || "",
        programme: student.programme || "",
        registrationDate: student.registrationDate || "",
        status: student.status || "",
      });
    }
  }, [student]);

  return (
    <div
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: COLORS.bgWhite }}
    >
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: COLORS.primary }}
      >
        Academic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Student Number
          </label>
          <input
            type="text"
            value={formData.studentNumber}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Faculty
          </label>
          <input
            type="text"
            value={formData.faculty}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Programme
          </label>
          <input
            type="text"
            value={formData.programme}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Registration Date
          </label>
          <input
            type="text"
            value={formatDate(formData.registrationDate)}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Status
          </label>
          <input
            type="text"
            value={formData.status}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            style={{ borderColor: COLORS.border }}
          />
        </div>

      </div>
    </div>
  );
};

export default StudentAcademics;
