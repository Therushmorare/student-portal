"use client"

import { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export function StudentProvider({ children, initialStudent }) {

  const calculateProgress = (updatedStudent) => {
    const requiredDocs = ['idDocument', 'proofOfResidence', 'academicTranscript', 'cv', 'bankStatement'];
    const uploadedDocs = updatedStudent.uploadedDocuments || {};

    let uploadedCount = 0;
    let verifiedCount = 0;

    requiredDocs.forEach(doc => {
      const docArray = uploadedDocs[doc] || [];
      if (docArray.length > 0) uploadedCount++;
      verifiedCount += docArray.filter(d => d.status === 'Verified').length;
    });

    const allDocsUploaded = requiredDocs.every(doc => (uploadedDocs[doc] || []).length > 0);
    const allDocsVerified = requiredDocs.every(doc => 
      (uploadedDocs[doc] || []).every(d => d.status === 'Verified')
    );

    return {
      documentsComplete: allDocsVerified,
      documentsUploaded: allDocsUploaded,
      verifiedCount,
      uploadedCount,
      totalRequired: requiredDocs.length
    };
  };

  const [student, setStudent] = useState(() => {
    if (!initialStudent) return null;
    const progress = calculateProgress(initialStudent);
    return {
      ...initialStudent,
      ...progress
    };
  });

  const updateStudent = (updates) => {
    setStudent(prev => {
      const updated = { ...prev, ...updates };
      const progress = calculateProgress(updated);

      return {
        ...updated,
        ...progress,
        status: progress.documentsComplete && updated.setaAllocation && updated.placement
          ? 'Active'
          : 'Pending'
      };
    });
  };

  const updateDocuments = (documents) => {
    updateStudent({ uploadedDocuments: documents });
  };

  const uploadDocument = (docKey, filesArr) => {
    setStudent(prev => {
      const existingDocs = prev.uploadedDocuments?.[docKey] || [];
      const uploadedDocs = {
        ...(prev.uploadedDocuments || {}),
        [docKey]: [...existingDocs, ...filesArr]
      };

      const updated = { ...prev, uploadedDocuments: uploadedDocs };
      const progress = calculateProgress(updated);

      const notification = {
        id: Date.now(),
        title: 'Document Uploaded',
        message: `${docKey.replace(/([A-Z])/g, ' $1').trim()} uploaded and pending verification.`,
        date: new Date().toISOString(),
        read: false,
        type: 'document'
      };

      return {
        ...updated,
        ...progress,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const signAgreement = (agreementKey) => {
    setStudent(prev => {
      const uploadedDocs = {
        ...(prev.uploadedDocuments || {}),
        [agreementKey]: {
          ...(prev.uploadedDocuments?.[agreementKey] || {}),
          signed: true,
          signedDate: new Date().toISOString(),
          status: 'Signed'
        }
      };

      const notification = {
        id: Date.now(),
        title: 'Agreement Signed',
        message: `Your ${agreementKey === 'setaAgreement' ? 'SETA' : 'Placement'} agreement has been successfully signed.`,
        date: new Date().toISOString(),
        read: false,
        type: 'agreement'
      };

      return {
        ...prev,
        uploadedDocuments: uploadedDocs,
        [agreementKey === 'setaAgreement' ? 'setaAgreementSigned' : 'placementAgreementSigned']: true,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const allocateSeta = (setaData) => {
    setStudent(prev => {
      const notification = {
        id: Date.now(),
        title: 'SETA Allocated',
        message: `You have been allocated to ${setaData.setaName}. Please download and sign your agreement.`,
        date: new Date().toISOString(),
        read: false,
        type: 'seta'
      };

      return {
        ...prev,
        setaAllocation: setaData,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const assignPlacement = (placementData) => {
    setStudent(prev => {
      const notification = {
        id: Date.now(),
        title: 'Placement Assigned',
        message: `You have been placed at ${placementData.companyName}. Please review and sign your placement agreement.`,
        date: new Date().toISOString(),
        read: false,
        type: 'placement'
      };

      return {
        ...prev,
        placement: placementData,
        notifications: [notification, ...(prev.notifications || [])]
      };
    });
  };

  const markNotificationRead = (notificationId) => {
    setStudent(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  const showToast = (message, type = 'info') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <StudentContext.Provider value={{
      student,
      updateStudent,
      updateDocuments,
      uploadDocument,
      signAgreement,
      allocateSeta,
      assignPlacement,
      markNotificationRead,
      showToast
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}