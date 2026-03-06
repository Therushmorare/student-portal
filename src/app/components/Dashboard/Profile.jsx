"use client"

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { COLORS } from '../../constants/colors';
import { formatDate } from '../../utils/date';

const StudentProfile = ({ student, onUpdate, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Personal Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: COLORS.success }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(student);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 border"
                style={{ color: COLORS.text, borderColor: COLORS.border }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              ID Number
            </label>
            <input
              type="text"
              value={formData.idNumber}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Placement Information */}
      {(student.setaAllocation || student.placement) && (
        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
            Placement Information
          </h2>
          <div className="space-y-6">
            {student.setaAllocation && (
              <div className="border-l-4 pl-4" style={{ borderColor: COLORS.info }}>
                <h3 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
                  SETA Allocation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">SETA Name</p>
                    <p className="font-medium" style={{ color: COLORS.primary }}>
                      {student.setaAllocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Agreement Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      student.setaAgreementSigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.setaAgreementSigned ? 'Signed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {student.placement && (
              <div className="border-l-4 pl-4" style={{ borderColor: COLORS.success }}>
                <h3 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Host Company Placement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-medium" style={{ color: COLORS.primary }}>
                      {student.placement.company}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Supervisor</p>
                    <p className="font-medium" style={{ color: COLORS.primary }}>
                      {student.placement.supervisor || 'TBA'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium" style={{ color: COLORS.primary }}>
                      {formatDate(student.placement.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Agreement Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      student.placementAgreementSigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.placementAgreementSigned ? 'Signed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;