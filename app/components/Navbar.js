"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Chatbot from "./Chatbot";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Brain, Circle } from "lucide-react";

const tabs = [
  { label: "home", path: "/" },
  { 
    label: "smart care", 
    path: "/smart-care",
    hasLiveDot: true,
    className: "smart-care-nav"
  },
  { label: "growth", path: "/Growth" },
  { label: "feeding", path: "/Feeding" },
  { label: "sleep", path: "/Sleep" },
  { label: "medical", path: "/Medical" },
  { label: "essentials", path: "/Essentials" },
  { label: "memories", path: "/Memories" },
  { label: "resources", path: "/Resources" },
  { label: "faqs", path: "/Faqs" },
  { label: "lullaby", path: "/Lullaby" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(100);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowModal(true);
    setProgress(100);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!showModal) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 3.33;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showModal]);

  useEffect(() => {
    if (progress <= 0 && showModal) {
      setShowModal(false);
      router.push("/");
    }
  }, [progress, showModal]);

  return (
    <>
      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] flex items-center justify-center transition-all duration-300">
          <div className="bg-white px-6 py-5 rounded-xl shadow-lg text-center w-[320px]">
            <p className="text-gray-800 mb-3">
              Logged out successfully.{" "}
              <Link href="/Login" className="text-pink-600 font-normal no-underline">
                Login
              </Link>{" "}
              again!
            </p>
            <div className="w-full h-1 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/logo.jpg" alt="NeoNest" width={60} height={60} />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ml-2">
                NeoNest
              </span>
            </div>

            {/* Hamburger - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-pink-600 focus:outline-none"
              >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Nav - Desktop */}
            <nav className="hidden md:flex items-center gap-4">
              {tabs.map(({ label, path, hasLiveDot, className }) => (
                <Link
                  key={label}
                  href={path}
                  className={`transition-colors capitalize relative ${className || ""} ${
                    pathname === path
                      ? "text-pink-600"
                      : "text-gray-600 hover:text-pink-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {label === "smart care" && <Brain size={16} />}
                    {label}
                    {hasLiveDot && (
                      <Circle 
                        className="live-indicator animate-pulse" 
                        fill="#ef4444" 
                        color="#ef4444"
                        size={8} 
                      />
                    )}
                  </span>
                </Link>
              ))}
            </nav>

            {/* CTA - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Chatbot />
              {!isAuth ? (
                <>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    <Link href="/Login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    <Link href="/Signup">Signup</Link>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 space-y-3">
              <div className="flex flex-col gap-3">
                {tabs.map(({ label, path, hasLiveDot, className }) => (
                  <Link
                    key={label}
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className={`block capitalize px-3 py-2 rounded-md text-sm relative ${className || ""} ${
                      pathname === path
                        ? "text-pink-600 font-medium"
                        : "text-gray-700 hover:text-pink-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {label === "smart care" && <Brain size={16} />}
                      {label}
                      {hasLiveDot && (
                        <Circle 
                          className="live-indicator animate-pulse" 
                          fill="#ef4444" 
                          color="#ef4444"
                          size={8} 
                        />
                      )}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {!isAuth ? (
                  <>
                    <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    <Link href="/Login">Login</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    <Link href="/Signup">Signup</Link>
                  </Button>
                  </>
                ) : (
                  <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  Logout
                </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Add Custom Styles for Smart Care */}
      <style jsx>{`
        .live-indicator {
          animation: pulse 2s infinite;
        }
        
        .smart-care-nav:hover .live-indicator {
          animation: none;
          opacity: 0.7;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;