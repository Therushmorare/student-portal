"use client";

import { useState, useEffect } from "react";
import { StudentProvider } from "/constants/context";
import Header from "./Header";
import Navigation from "./Navigation";

export default function PortalLayout({ children }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = sessionStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  if (!student) return null; // or a loading spinner

  return (
    <StudentProvider initialStudent={student}>
      <Header />
      <Navigation />
      {children}
    </StudentProvider>
  );
}