"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ROUTES from '@/app/utils/routes';
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaCode, FaUserTie, FaPrayingHands } from "react-icons/fa";

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Services",
    href: "#",
    dropdownItems: [
      { name: "Web Development", href: "/webdevelopment" },
      { name: "Mobile App Development", href: "/mobileappdev" },
    ],
  },
  { name: "About Us", href: "/about" },
  { name: "Past Projects", href: "/pastprojects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
  { name: "Client Feedback", href: "/feedbacks" },
  { name: "Careers", href: "/careers" },
];

export default function Navbar() {
  const pathname = usePathname(); // ✅ Next.js alternative to useLocation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);

  const isActivePath = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMouseEnter = (itemName) => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setActiveDropdown(null), 1000);
    setCloseTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [closeTimeout]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <nav
        className="flex items-center justify-between p-2 lg:px-6 max-w-7xl mx-auto"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 p-1 flex items-center space-x-2 group hover:opacity-80 transition-opacity"
          >
<div className="relative w-12 h-12 rounded-full overflow-hidden group">
  <Image
    src="/logo.jpg"
    alt="Logo"
    fill
    style={{ objectFit: "cover" }} // ensures the image covers the container
    sizes="48px" // optional for optimization
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 filter blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
</div>

            <div className="flex flex-col">
              <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Websites Arena
              </span>
              <span className="text-blue-400 text-xs hidden sm:block font-medium">
                Web and Mobile App Development Agency
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-5">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.dropdownItems ? (
                <>
                  <button
                    className="text-xs font-semibold leading-5 text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-1 group cursor-pointer transform hover:-translate-y-0.5 px-2 py-1"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.name ? null : item.name
                      )
                    }
                  >
                    <span>{item.name}</span>
                    <svg
                      className={`h-3 w-3 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activeDropdown === item.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 rounded-xl bg-gray-800/95 backdrop-blur-lg shadow-xl ring-1 ring-gray-700 transform transition-all duration-300 animate-in p-1.5">
                      <div className="py-1 px-0.5">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-3 py-2 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-blue-600/10 transition-all duration-200 mx-0.5 group"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`text-xs font-semibold leading-5 transition-all duration-300 relative group px-2 py-1 rounded-lg ${
                    isActivePath(item.href)
                      ? "text-white bg-blue-600 shadow-md shadow-blue-500/20"
                      : "text-gray-300 hover:text-white hover:bg-blue-600/10"
                  }`}
                >
                  {item.name}
                  {isActivePath(item.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full transform scale-x-100"></span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* CTA and Partners */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-3">


          {/* Partners Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("partners")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white font-semibold text-xs transition-all duration-300">
              <FaCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Partners</span>
              <svg
                className={`h-3 w-3 transition-transform duration-200 ${
                  activeDropdown === "partners" ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeDropdown === "partners" && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-gray-800/95 backdrop-blur-lg shadow-xl ring-1 ring-gray-700 p-1.5">
                <Link
                  href="/signin"
                  className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-purple-600/10 transition-all group"
                >
                  <FaCode className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                  <span>Developers</span>
                </Link>
                <Link
                  href="/clientauth"
                  className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-blue-600/10 transition-all group"
                >
                  <FaUserTie className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                  <span>Clients</span>
                </Link>
                <Link
                  href="/storyofhope"
                  className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-amber-600/10 transition-all group"
                >
                  <FaPrayingHands className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                  <span>StoryOfHope</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-4 py-4 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="-m-1.5 p-1.5 flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-white font-bold text-lg">
                  Websites Arena
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdownItems ? (
                    <>
                      <div className="block rounded-lg px-2 py-2 text-sm font-semibold text-gray-300">
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block rounded-lg px-2 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-2 py-2 text-sm font-semibold transition-colors relative ${
                        isActivePath(item.href)
                          ? "text-white bg-blue-600/20 border-l-4 border-blue-500"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Partners Section in Mobile */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <button
                className="w-full flex items-center justify-between px-2 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-800/70"
                onClick={() => setActiveDropdown(activeDropdown === "partners-mobile" ? null : "partners-mobile")}
              >
                <div className="flex items-center space-x-2">
                  <FaCode className="w-4 h-4 text-emerald-400" />
                  <span>Partners</span>
                </div>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === "partners-mobile" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeDropdown === "partners-mobile" && (
                <div className="mt-2 pl-4 space-y-1">
                  <Link
                    href="/signin"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-purple-600/10 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaCode className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    <span>Developers</span>
                  </Link>
                  <Link
                    href="/clientauth"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-blue-600/10 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserTie className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span>Clients</span>
                  </Link>
                  <Link
                    href="/storyofhope"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-amber-600/10 transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaPrayingHands className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                    <span>StoryOfHope</span>
                  </Link>
                </div>
              )}
            </div>

          </Dialog.Panel>
        </Dialog>
      </nav>
    </header>
  );
}
