"use client"

import React from 'react';
import { User, FileText, Award, Building2, Bell } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { COLORS } from '../../constants/colors';

const StudentDashboard = ({ student, onNavigate }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Suspended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const progressSteps = [
    { 
      label: 'Registration', 
      status: 'completed', 
      icon: User,
      description: 'Account created'
    },
    { 
      label: 'Documents', 
      status: student.documentsComplete ? 'completed' : 'pending', 
      icon: FileText,
      description: student.documentsComplete ? 'Verified' : 'Upload required'
    },
    { 
      label: 'SETA Allocation', 
      status: student.setaAllocation ? 'completed' : 'pending', 
      icon: Award,
      description: student.setaAllocation ? 'Allocated' : 'Awaiting allocation'
    },
    { 
      label: 'Placement', 
      status: student.placement ? 'completed' : 'pending', 
      icon: Building2,
      description: student.placement ? 'Placed' : 'Awaiting placement'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.primary }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome back, {student.firstName}!
            </h1>
            <p className="text-blue-100">
              Student Number: {student.studentNumber}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(student.status)}`}>
            {student.status}
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
          Your Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {progressSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isPending = step.status === 'pending';
            
            return (
              <div key={index} className="relative">
                <div className={`rounded-lg p-4 border-2 ${
                  isCompleted ? 'border-green-500 bg-green-50' : 
                  isPending ? 'border-yellow-500 bg-yellow-50' : 
                  'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${
                      isCompleted ? 'bg-green-500' : 
                      isPending ? 'bg-yellow-500' : 
                      'bg-gray-400'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm" style={{ color: COLORS.text }}>
                      {step.label}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 ml-11">{step.description}</p>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <div className={`w-4 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.text }}>Documents</h3>
            <FileText className="w-5 h-5" style={{ color: COLORS.info }} />
          </div>
          <p className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {sessionStorage.getItem('uploadedDocumentsCount') || 0}/{student.totalRequired || 5}
          </p>
          <p className="text-sm text-gray-600">
            {student.documentsComplete ? 'All verified' : 'Upload required'}
          </p>
          {!student.documentsComplete && (
            <button
              onClick={() => onNavigate('documents')}
              className="mt-3 w-full px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: COLORS.info }}
            >
              Upload Now
            </button>
          )}
        </div>

        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.text }}>SETA Allocation</h3>
            <Award className="w-5 h-5" style={{ color: COLORS.secondary }} />
          </div>
          <p className="text-lg font-bold mb-2" style={{ color: COLORS.primary }}>
            {student.setaAllocation ? student.setaAllocation.setaName : 'Not Allocated'}
          </p>
          <p className="text-sm text-gray-600">
            {student.setaAllocation ? 'Agreement pending' : 'Awaiting allocation'}
          </p>
        </div>

        <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: COLORS.text }}>Placement</h3>
            <Building2 className="w-5 h-5" style={{ color: COLORS.success }} />
          </div>
          <p className="text-lg font-bold mb-2" style={{ color: COLORS.primary }}>
            {student.placement ? student.placement.companyName : 'Not Placed'}
          </p>
          <p className="text-sm text-gray-600">
            {student.placement ? 'Active placement' : 'Awaiting placement'}
          </p>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Recent Notifications
          </h2>
          <button
            onClick={() => onNavigate('notifications')}
            className="text-sm font-medium"
            style={{ color: COLORS.info }}
          >
            View All
          </button>
        </div>
        {student.notifications && student.notifications.length > 0 ? (
          <div className="space-y-3">
            {student.notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: COLORS.bgLight }}
              >
                <Bell className="w-5 h-5 mt-0.5" style={{ color: COLORS.info }} />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm" style={{ color: COLORS.text }}>
                    {notif.title}
                  </h4>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(notif.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No notifications yet</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;