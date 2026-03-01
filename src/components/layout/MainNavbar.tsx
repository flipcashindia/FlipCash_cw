/**
 * Main Navbar - Updated with City Selection & Service Availability
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, User, Menu, X, Wallet, MapPin, 
  ShoppingBag, BookOpen, LogOut, Settings, HelpCircle, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCityContext } from '../../context/CityContext';
import AuthModal from '../auth/AuthModal';
import SearchModal from '../search/SearchModal';
import logo from '../../../public/flipcash_header_logo.png';
import CityPickerModal from './CityPickerModal';

const MainNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    selectedCity, 
    isServiceAvailable, 
    openCityModal 
  } = useCityContext();
  
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
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

  return (
    <>
      <nav className="bg-[#FEC925] shadow-md sticky top-0 z-40 border-b-2 border-[#1C1C1B]/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* --- Logo and Desktop Links --- */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={logo} alt="FlipCash" className="h-10" />
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-[#1C1C1B] hover:opacity-70 transition-colors font-bold">Home</Link>
                <Link to="/sell-old-product" className="text-[#1C1C1B] hover:opacity-70 transition-colors font-bold">Sell Device</Link>
                <Link to="/about" className="text-[#1C1C1B] hover:opacity-70 transition-colors font-bold">About</Link>
              </div>
            </div>

            {/* --- Right Side Actions --- */}
            <div className="flex items-center space-x-2 md:space-x-4">
              
              {/* --- CITY SELECTOR (Cashify Style) --- */}
              <button 
                onClick={openCityModal}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-white/20 rounded-xl transition-all group"
              >
                <div className="p-1.5 bg-white/40 rounded-lg group-hover:bg-white/60 transition-colors">
                  <MapPin size={18} className="text-[#1C1C1B]" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-extrabold text-[#1C1C1B]">
                      {selectedCity || 'Delhi'}
                    </span>
                    <ChevronDown size={14} className="text-[#1C1C1B]" />
                  </div>
                  {!isServiceAvailable && (
                    <p className="text-[10px] font-bold text-red-600 leading-none">
                      Unavailable
                    </p>
                  )}
                </div>
              </button>

              {/* Search Icon */}
              <button 
                onClick={() => setShowSearchModal(true)} 
                className="p-2.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <Search size={20} className="text-[#1C1C1B]" />
              </button>

              {/* User Dropdown or Login Button */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 px-2 py-1.5 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#1C1C1B] text-[#FEC925] rounded-full flex items-center justify-center font-bold border-2 border-white/30">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <ChevronDown size={16} className={`text-[#1C1C1B] transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.phone}</p>
                      </div>
                      <div className="py-1">
                        <button onClick={() => handleMenuItemClick('/my-account')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 font-medium">
                          <User size={16} /> My Account
                        </button>
                        <button onClick={() => handleMenuItemClick('/my-account/addresses')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 font-medium">
                          <MapPin size={16} /> My Addresses
                        </button>
                        <button onClick={() => handleMenuItemClick('/my-account/my-orders')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 font-medium">
                          <ShoppingBag size={16} /> My Orders
                        </button>
                      </div>
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="px-6 py-2.5 bg-[#1C1C1B] text-white font-bold rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)} 
                className="md:hidden p-2 text-[#1C1C1B]"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Items */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 space-y-1 border-t border-[#1C1C1B]/10 pt-4 animate-in fade-in slide-in-from-top-2">
              <Link to="/" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-[#1C1C1B] font-bold hover:bg-white/20 rounded-lg">Home</Link>
              <Link to="/sell-old-product" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-[#1C1C1B] font-bold hover:bg-white/20 rounded-lg">Sell Device</Link>
              <Link to="/about" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-[#1C1C1B] font-bold hover:bg-white/20 rounded-lg">About</Link>
              <Link to="/contact" onClick={() => setShowMobileMenu(false)} className="block py-3 px-4 text-[#1C1C1B] font-bold hover:bg-white/20 rounded-lg">Contact</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {showSearchModal && <SearchModal onClose={() => setShowSearchModal(false)} />}
      <CityPickerModal />
    </>
  );
};

export default MainNavbar;