/**
 * Main Navbar - Responsive navigation with user dropdown
 * ✅ UPDATED: FlipCash theme, AuthModal integration, profile completion support
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, Wallet, MapPin, ShoppingBag, BookOpen, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import SearchModal from '../search/SearchModal';
import logo from '../../assets/logo.png';

interface MainNavbarProps {
  isLoggedIn?: boolean;
  onAccountClick?: () => void;
}

const MainNavbar: React.FC<MainNavbarProps> = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleMenuItemClick = (path: string) => {
    setShowUserDropdown(false);
    setShowMobileMenu(false);
    navigate(path);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Check if profile is complete after login
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (!userData.name || userData.name.trim() === '') {
        // AuthModal will handle profile completion internally
        return;
      }
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-[#FEC925]/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src={logo} alt="FlipCash" className="h-10" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-[#1C1C1B] hover:text-[#FEC925] transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/sell-old-product" 
                className="text-[#1C1C1B] hover:text-[#1B8A05] transition-colors font-medium"
              >
                Sell Device
              </Link>
              <Link 
                to="/blog" 
                className="text-[#1C1C1B] hover:text-[#FEC925] transition-colors font-medium"
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                className="text-[#1C1C1B] hover:text-[#FEC925] transition-colors font-medium"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-[#1C1C1B] hover:text-[#FEC925] transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button 
                onClick={() => setShowSearchModal(true)} 
                className="p-2.5 hover:bg-[#F0F7F6] rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-[#1C1C1B]" />
              </button>

              {/* Authenticated User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-[#F0F7F6] rounded-xl transition-colors border-2 border-transparent hover:border-[#FEC925]/30"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] rounded-full flex items-center justify-center text-[#1C1C1B] font-bold">
                      {user?.name ? user.name[0].toUpperCase() : user?.phone?.[0] || 'U'}
                    </div>
                    <span className="hidden md:block text-[#1C1C1B] font-semibold">
                      {user?.name || user?.phone?.slice(-10)}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-[#FEC925]/30 py-2 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-[#F0F7F6] to-[#EAF6F4] border-b-2 border-[#FEC925]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] rounded-full flex items-center justify-center text-[#1C1C1B] font-bold text-xl">
                            {user?.name ? user.name[0].toUpperCase() : user?.phone?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1C1C1B]">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-600">{user?.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => handleMenuItemClick('/my-account')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <User size={18} className="text-[#1B8A05]" />
                          </div>
                          <span className="font-medium">My Account</span>
                        </button>

                        <button
                          onClick={() => handleMenuItemClick('/my-account/addresses')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <MapPin size={18} className="text-[#1B8A05]" />
                          </div>
                          <span className="font-medium">My Addresses</span>
                        </button>

                        <button
                          onClick={() => handleMenuItemClick('/my-account/my-orders')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <ShoppingBag size={18} className="text-[#FEC925]" />
                          </div>
                          <span className="font-medium">My Orders</span>
                        </button>

                        <button
                          onClick={() => handleMenuItemClick('/my-account/my-wallet')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <Wallet size={18} className="text-[#1B8A05]" />
                          </div>
                          <span className="font-medium">My Wallet</span>
                        </button>

                        <button
                          onClick={() => handleMenuItemClick('/my-account/passbook')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <BookOpen size={18} className="text-[#FEC925]" />
                          </div>
                          <span className="font-medium">Passbook</span>
                        </button>

                        <button
                          onClick={() => handleMenuItemClick('/my-account/account-details')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <Settings size={18} className="text-[#1B8A05]" />
                          </div>
                          <span className="font-medium">Settings</span>
                        </button>

                        <button
                          onClick={() => handleMenuItemClick('/my-account/helpdesk')}
                          className="w-full text-left px-4 py-3 hover:bg-[#F0F7F6] transition-colors flex items-center space-x-3 text-[#1C1C1B] group"
                        >
                          <div className="p-2 bg-[#F0F7F6] rounded-lg group-hover:bg-white transition-colors">
                            <HelpCircle size={18} className="text-[#FEC925]" />
                          </div>
                          <span className="font-medium">Help & Support</span>
                        </button>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t-2 border-[#FEC925]/20 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600 group"
                        >
                          <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                            <LogOut size={18} />
                          </div>
                          <span className="font-bold">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button */
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] font-bold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)} 
                className="md:hidden p-2 hover:bg-[#F0F7F6] rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X size={24} className="text-[#1C1C1B]" />
                ) : (
                  <Menu size={24} className="text-[#1C1C1B]" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 space-y-2 border-t-2 border-[#FEC925]/20 pt-4 animate-fadeIn">
              <Link 
                to="/" 
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/sell-old-product" 
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors font-medium"
              >
                Sell Device
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors font-medium"
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors font-medium"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setShowMobileMenu(false)}
                className="block py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors font-medium"
              >
                Contact
              </Link>
              
              {/* Mobile User Menu */}
              {isAuthenticated && (
                <div className="border-t-2 border-[#FEC925]/20 mt-3 pt-3 space-y-2">
                  <div className="px-4 py-2 bg-[#F0F7F6] rounded-lg mb-3">
                    <p className="text-sm font-bold text-[#1C1C1B]">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-600">{user?.phone}</p>
                  </div>

                  <Link 
                    to="/my-account" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors"
                  >
                    <User size={18} className="text-[#1B8A05]" />
                    <span className="font-medium">My Account</span>
                  </Link>
                  
                  <Link 
                    to="/my-addresses" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors"
                  >
                    <MapPin size={18} className="text-[#1B8A05]" />
                    <span className="font-medium">My Addresses</span>
                  </Link>
                  
                  <Link 
                    to="/my-leads" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors"
                  >
                    <ShoppingBag size={18} className="text-[#FEC925]" />
                    <span className="font-medium">My Orders</span>
                  </Link>
                  
                  <Link 
                    to="/my-wallet" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors"
                  >
                    <Wallet size={18} className="text-[#1B8A05]" />
                    <span className="font-medium">My Wallet</span>
                  </Link>
                  
                  <Link 
                    to="/passbook" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors"
                  >
                    <BookOpen size={18} className="text-[#FEC925]" />
                    <span className="font-medium">Passbook</span>
                  </Link>

                  <Link 
                    to="/helpdesk" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 py-3 px-4 text-[#1C1C1B] hover:bg-[#F0F7F6] rounded-lg transition-colors"
                  >
                    <HelpCircle size={18} className="text-[#FEC925]" />
                    <span className="font-medium">Help & Support</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                  >
                    <LogOut size={18} />
                    <span className="font-bold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)} 
        onLoginSuccess={handleAuthSuccess}
      />
      
      {/* Search Modal */}
      {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}
    </>
  );
};

export default MainNavbar;