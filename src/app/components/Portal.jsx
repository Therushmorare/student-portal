"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, FileText, User, Bell, CreditCard, IdCard, GraduationCap } from "lucide-react";
import { COLORS } from "../constants/colors";

import { StudentProvider, useStudent } from "../constants/context"; // ✅ import context
import Header from "./Header";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import DocumentUpload from "./Documents";
import Notifications from "./Notifications";
import Banking from "./Banking/Banking";
import Bio from "./Dashboard/Bio";
import Academics from "./Dashboard/Academics";

// Wrapper to provide context and access showToast
function DocumentsWrapper() {
  const { showToast } = useStudent(); //get showToast from context
  return <DocumentUpload showToast={showToast} />;
}

export default function StudentPortal() {
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  // Load student from sessionStorage
  useEffect(() => {
    const savedStudent = sessionStorage.getItem("student");

    if (!savedStudent) {
      router.push("/login"); // Not logged in
    } else {
      try {
        setCurrentStudent(JSON.parse(savedStudent));
      } catch (error) {
        console.error("Invalid JSON in sessionStorage:", error);
        sessionStorage.removeItem("student");
        router.push("/login");
      }
    }
  }, [router]);

  // Logout removes correct key
  const handleLogout = () => {
    sessionStorage.removeItem("student");
    router.push("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
    { id: "banking", label: "Banking", icon: CreditCard},
    { id: "biographical", label: "Biographical", icon: IdCard},
    { id: "academics", label: "Academics", icon: GraduationCap},
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  // Prevent UI from flashing before loading student
  if (!currentStudent) return null;

  return (
    <StudentProvider initialStudent={currentStudent}>
      <div className="min-h-screen" style={{ backgroundColor: COLORS.bgLight }}>
        <Header
          student={currentStudent}
          onLogout={handleLogout}
          onNavigate={setActiveView}
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeView === item.id
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        activeView === item.id ? COLORS.primary : COLORS.bgWhite,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {activeView === "dashboard" && (
              <Dashboard student={currentStudent} onNavigate={setActiveView} />
            )}
            {activeView === "profile" && <Profile student={currentStudent} />}
            {activeView === "documents" && (
              <div
                className="rounded-lg p-8 shadow-sm text-center"
                style={{ backgroundColor: COLORS.bgWhite }}
              >
                <DocumentsWrapper />
              </div>
            )}
            {activeView === "banking" && <Banking student={currentStudent} />}
            
            {activeView === "biographical" && <Bio student={currentStudent} />}

            {activeView === "academics" && <Academics student={currentStudent} />}

            {activeView === "notifications" && (
              <div
                className="rounded-lg p-8 shadow-sm text-center"
                style={{ backgroundColor: COLORS.bgWhite }}
              >
                <Notifications student={currentStudent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentProvider>
  );
}