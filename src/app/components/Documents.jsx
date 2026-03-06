"use client"

import React, { useState, useEffect } from 'react';
import { FileText, GraduationCap, Award, Building2, Upload, Download, Calendar, DollarSign, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants/colors';
import { formatDate } from '../utils/date';
import { useStudent } from '../constants/context';

const DocumentUpload = () => {
  const { student, signAgreement, showToast } = useStudent();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});

  const requiredDocuments = [
    { key: 'idDocument', label: 'ID Document / Passport', icon: FileText, required: true },
    { key: 'proofOfResidence', label: 'Proof of Residence', icon: FileText, required: true },
    { key: 'academicTranscript', label: 'Academic Transcript', icon: GraduationCap, required: true },
    { key: 'cv', label: 'Curriculum Vitae (CV)', icon: FileText, required: true },
    { key: 'bankStatement', label: 'Bank Statement', icon: FileText, required: true }
  ];

  const agreementDocuments = [
    { 
      key: 'setaAgreement', 
      label: 'SETA Agreement', 
      icon: Award, 
      required: !!student.setaAllocation,
      downloadable: true,
      available: !!student.setaAllocation,
      companyName: student.setaAllocation?.setaName
    },
    { 
      key: 'placementAgreement', 
      label: 'Placement Agreement', 
      icon: Building2, 
      required: !!student.placement,
      downloadable: true,
      available: !!student.placement,
      companyName: student.placement?.companyName
    }
  ];

  // Fetch all uploaded documents from API
  const loadUploadedDocs = async () => {
    if (!student?.id) return;

    try {
      const res = await fetch(
        `https://vaalsetaapi-7hrsa.ondigitalocean.app/api/students/documents/${student.id}`
      );

      if (!res.ok) {
        console.error("Failed to load documents");
        return;
      }

      const data = await res.json();

      // Transform API list → grouped by doc_type
      const grouped = {};
      (data.documents || []).forEach((doc) => {
        if (!grouped[doc.doc_type]) grouped[doc.doc_type] = [];
        grouped[doc.doc_type].push({
          name: doc.document.split("/").pop(),
          url: doc.document,
          status: "Pending Verification",
          uploadDate: new Date().toISOString()
        });
      });

      setUploadedDocs(grouped);

      // Save uploaded documents count in sessionStorage
      const uploadedCount = Object.keys(grouped).length;
      sessionStorage.setItem('uploadedDocumentsCount', uploadedCount);

    } catch (err) {
      console.error("Document load error:", err);
    }
  };

  useEffect(() => {
    loadUploadedDocs();
  }, [student]);

  const totalRequired = requiredDocuments.length;
  const uploadedCount = requiredDocuments.filter(doc => uploadedDocs[doc.key]?.length).length;
  const verifiedCount = requiredDocuments.filter(doc => uploadedDocs[doc.key]?.some(d => d.status === 'Verified')).length;

  const handleFileSelect = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }

      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showToast('Only PDF, JPG, and PNG files are allowed', 'error');
        return;
      }

      setSelectedFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleUpload = async (key) => {
    if (!selectedFiles[key]) return;

    const file = selectedFiles[key];

    const formData = new FormData();
    formData.append("user_id", student.id);
    formData.append("document_type", key);
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://vaalsetaapi-7hrsa.ondigitalocean.app/api/students/upload/supporting-documents",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text();

      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON response from server:", text);
      }

      if (!res.ok) {
        showToast(data.message || "Upload failed", "error");
        return;
      }

      //ALWAYS re-fetch documents from backend
      await loadUploadedDocs();

      showToast("Document uploaded successfully", "success");

      // Clear selected file
      setSelectedFiles(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

    } catch (error) {
      console.error("Upload error:", error);
      showToast("Error uploading document. Try again.", "error");
    }
  };

  const handleDownload = (key, companyName) => {
    showToast(`Downloading ${companyName || ''} agreement...`, 'success');
  };

  const handleSignAgreement = (key) => {
    signAgreement(key);
    showToast('Agreement signed successfully!', 'success');
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending Verification': 'bg-yellow-100 text-yellow-800',
      'Verified': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Signed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Document Progress
          </h2>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
              {uploadedCount}/{totalRequired}
            </p>
            <p className="text-sm text-gray-600">Documents Uploaded</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${(uploadedCount / totalRequired) * 100}%`,
                backgroundColor: uploadedCount === totalRequired ? COLORS.success : COLORS.info
              }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {verifiedCount} Verified
          </span>
        </div>
        {uploadedCount < totalRequired && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-yellow-50">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Please upload all required documents to proceed with SETA allocation.
            </p>
          </div>
        )}
      </div>

      {/* Required Documents */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
          Required Documents
        </h2>
        <div className="space-y-4">
          {requiredDocuments.map(doc => {
            const Icon = doc.icon;
            const uploaded = uploadedDocs[doc.key] || [];
            const selected = selectedFiles[doc.key];

            return (
              <div key={doc.key} className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                    <Icon className="w-6 h-6" style={{ color: COLORS.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold" style={{ color: COLORS.primary }}>
                        {doc.label}
                      </h3>
                      {doc.required && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </div>

                    {/* Display uploaded files */}
                    {uploaded.length ? (
                      uploaded.map((file, index) => (
                        <div key={index} className="space-y-2 mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: COLORS.success }} />
                            <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">
                              {file.name}
                            </a>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(file.status)}`}>
                              {file.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Uploaded: {formatDate(file.uploadDate)}
                          </p>
                        </div>
                      ))
                    ) : selected ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{selected.name}</span>
                        <button
                          onClick={() => handleUpload(doc.key)}
                          className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                          style={{ backgroundColor: COLORS.success }}
                        >
                          Upload
                        </button>
                        <button
                          onClick={() => setSelectedFiles(prev => {
                            const updated = { ...prev };
                            delete updated[doc.key];
                            return updated;
                          })}
                          className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                          style={{ color: COLORS.text }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id={doc.key}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileSelect(doc.key, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={doc.key}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          <Upload className="w-4 h-4" />
                          Select File
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF, JPG, or PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agreements */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>
          Agreements
        </h2>
        {!student.documentsComplete && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Agreements will become available once all required documents are verified.
            </p>
          </div>
        )}
        <div className="space-y-4">
          {agreementDocuments.map(doc => {
            const Icon = doc.icon;
            const uploaded = uploadedDocs[doc.key]?.[0];

            if (!doc.available) {
              return (
                <div key={doc.key} className="border rounded-lg p-4 bg-gray-50" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-200">
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400">{doc.label}</h3>
                      <p className="text-sm text-gray-500">
                        {doc.key === 'setaAgreement' 
                          ? 'Available after SETA allocation' 
                          : 'Available after placement assignment'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={doc.key} className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
                    <Icon className="w-6 h-6" style={{ color: COLORS.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: COLORS.primary }}>
                          {doc.label}
                        </h3>
                        <p className="text-sm text-gray-600">{doc.companyName}</p>
                      </div>
                      {uploaded?.signed && (
                        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                          ✓ Signed
                        </span>
                      )}
                    </div>

                    {uploaded?.signed ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" style={{ color: COLORS.success }} />
                          <span className="text-sm font-medium text-green-600">Agreement Signed</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Signed on: {formatDate(uploaded.signedDate)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-3">
                          Please review and sign your agreement to proceed.
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDownload(doc.key, doc.companyName)}
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 border flex items-center gap-2"
                            style={{ color: COLORS.text, borderColor: COLORS.border }}
                          >
                            <Download className="w-4 h-4" />
                            Download & Review
                          </button>
                          <button
                            onClick={() => handleSignAgreement(doc.key)}
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                            style={{ backgroundColor: COLORS.success }}
                          >
                            Sign Agreement
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;