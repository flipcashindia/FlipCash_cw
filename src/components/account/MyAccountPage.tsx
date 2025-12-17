import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Wallet, 
  MapPin, 
  User, 
  HelpCircle, 
  Flag, 
  MessageSquare, 
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';

export type MenuTab = 'Dashboard' | 'My Orders' | 'My Wallet'| 'Addresses' | 'Account Details' |'KYC' | 'Bank' | 'Helpdesk' | 'Raise Dispute' | 'Feedback';

interface MyAccountPageProps {
  username?: string;
  onNavClick: (tab: MenuTab | 'Passbook') => void;
  onBreadcrumbClick: (path: string) => void;
  onLogout: () => void;
}

const MyAccountPage: React.FC<MyAccountPageProps> = ({ username, onNavClick, onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const displayName = user?.name || username || 'User';

  // FlipCash Brand Colors
  const COLORS = {
    primary: '#FEC925',     // Yellow
    success: '#1B8A05',     // Green
    error: '#FF0000',       // Red
    text: '#1C1C1B',        // Black
  };

  const menuItems = [
    { id: 'My Orders' as MenuTab, label: 'My Orders', icon: ShoppingBag, color: 'text-blue-600' },
    { id: 'My Wallet' as MenuTab, label: 'My Wallet', icon: Wallet, color: 'text-green-600' },
    { id: 'Addresses' as MenuTab, label: 'Addresses', icon: MapPin, color: 'text-red-600' },
    { id: 'Account Details' as MenuTab, label: 'Account Details', icon: User, color: 'text-purple-600' },
    { id: 'KYC' as MenuTab, label: 'KYC Verification', icon: ShieldCheck, color: 'text-emerald-600' },
    { id: 'Bank' as MenuTab, label: 'Bank Accounts', icon: Building2, color: 'text-indigo-600' },
    { id: 'Helpdesk' as MenuTab, label: 'Helpdesk', icon: HelpCircle, color: 'text-orange-600' },
    { id: 'Raise Dispute' as MenuTab, label: 'Raise Dispute', icon: Flag, color: 'text-pink-600' },
    { id: 'Feedback' as MenuTab, label: 'Feedback', icon: MessageSquare, color: 'text-teal-600' },
  ];

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.success})` }}
              >
                {displayName[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  My Account
                </h1>
                <p className="text-gray-600">Welcome back, {displayName}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-red-50"
              style={{ color: COLORS.error }}
            >
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-transparent transition-all shadow-sm hover:shadow-md"
                style={{
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div className={`p-3 bg-white rounded-lg shadow-sm ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* User Stats */}
          {isAuthenticated && user && (
            <div className="">
              {/* <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>
                Account Overview
              </h3> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Profile Completion */}
                {/* <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <p className="text-sm text-gray-600">Profile Completion</p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {user.profile_completion_percentage || 0}%
                  </p>
                </div> */}

                {/* Account Status */}
                {/* <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${COLORS.success}20` }}
                >
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: COLORS.success }}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div> */}

                {/* Phone Verified */}
                {/* <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Phone Verified</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {user.is_phone_verified ? '✓ Yes' : '✗ No'}
                  </p>
                </div> */}

                {/* KYC Status */}
                {/* <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: user.kyc_status === 'verified' 
                      ? `${COLORS.success}20` 
                      : user.kyc_status === 'pending' 
                      ? `${COLORS.primary}20`
                      : `${COLORS.error}20`
                  }}
                >
                  <p className="text-sm text-gray-600">KYC Status</p>
                  <p 
                    className="text-2xl font-bold capitalize"
                    style={{ 
                      color: user.kyc_status === 'verified' 
                        ? COLORS.success 
                        : user.kyc_status === 'pending'
                        ? COLORS.primary
                        : COLORS.error
                    }}
                  >
                    {user.kyc_status || 'Pending'}
                  </p>
                </div> */}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MyAccountPage;