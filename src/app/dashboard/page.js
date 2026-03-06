"use client"

import StudentPortal from '../components/Portal';
import { StudentProvider } from '../constants/context';

// Mock initial student data - replace with your actual data fetching
const mockStudent = {
  id: 1,
  studentNumber: 'VUT2024001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  status: 'Pending',
  documentsComplete: false,
  uploadedDocuments: {},
  setaAllocation: null,
  placement: null,
  notifications: [
    {
      id: 1,
      title: 'Welcome!',
      message: 'Welcome to the Vaal Student Portal. Please upload your documents to get started.',
      date: new Date().toISOString(),
      read: false,
      type: 'system'
    }
  ]
};

export default function Student() {
  return (
    <StudentProvider initialStudent={mockStudent}>
      <StudentPortal />
    </StudentProvider>
  );
}