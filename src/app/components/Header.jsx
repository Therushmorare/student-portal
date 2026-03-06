"use client";

import { useState } from 'react';
import Head from "next/head";
import { GraduationCap, ChevronDown, User, LogOut } from 'lucide-react';
import { COLORS } from '../constants/colors';

const Header = ({ student, onLogout, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const getInitials = () => {
    return `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
  };

  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://res.cloudinary.com/dbuuizuka/image/upload/c_fill,w_32,h_32/v1761697835/id3tj44Wsz_1761674029816_z2fjde.png"
        />
      </Head>

      <header className="shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {imageLoaded ? (
                <img
                  src="https://res.cloudinary.com/dbuuizuka/image/upload/v1761697835/id3tj44Wsz_1761674029816_z2fjde.png"
                  alt="Graduation Cap"
                  className="w-16 h-16 object-contain"
                  onError={() => setImageLoaded(false)}
                />
              ) : (
                <GraduationCap
                  className="w-16 h-16"
                  style={{ color: COLORS.primary }}
                />
              )}
              <h1 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                Student Portal
              </h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {getInitials()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-sm" style={{ color: COLORS.text }}>
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{student.studentNumber}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50"
                  style={{ backgroundColor: COLORS.bgWhite }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
                    <p className="font-semibold" style={{ color: COLORS.text }}>
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{student.studentNumber}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onNavigate('profile');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <User className="w-4 h-4" style={{ color: COLORS.primary }} />
                    <span className="text-sm">View Profile</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    style={{ color: COLORS.danger }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;